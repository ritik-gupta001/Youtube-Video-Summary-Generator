from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import openai
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_core.documents import Document
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="YouTube Video Summarizer API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store for video sessions (in production, use a database)
video_sessions = {}

class VideoRequest(BaseModel):
    video_url: str

class ChatRequest(BaseModel):
    session_id: str
    question: str

class ChatResponse(BaseModel):
    answer: str
    session_id: str

def extract_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    # Handle various YouTube URL formats
    if "youtu.be" in url:
        return url.split("/")[-1].split("?")[0]
    elif "youtube.com" in url:
        parsed = urlparse(url)
        if parsed.path == "/watch":
            return parse_qs(parsed.query).get("v", [None])[0]
        elif parsed.path.startswith("/embed/"):
            return parsed.path.split("/")[2]
    return None

def get_transcript(video_id: str) -> str:
    """Fetch transcript from YouTube video"""
    try:
        # Use the new API for youtube-transcript-api >= 1.0.0
        api = YouTubeTranscriptApi()
        
        # First, list available transcripts for this video
        try:
            available_transcripts = api.list(video_id)
        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Could not retrieve transcript information for this video. The video may not have captions, or it might be private/age-restricted. Error: {str(e)}"
            )
        
        # Try to get transcript in preferred order: English, then any available language
        preferred_languages = ['en', 'en-US', 'en-GB', 'hi', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ar']
        
        result = None
        
        # Try preferred languages first
        for lang in preferred_languages:
            try:
                result = api.fetch(video_id, languages=[lang])
                break  # Successfully fetched, exit loop
            except Exception:
                continue  # Try next language
        
        # If still no result, try to get ANY available transcript
        if result is None:
            try:
                # Get the first available transcript (any language)
                result = api.fetch(video_id, languages=[])  # Empty list means any language
            except Exception as e:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Could not retrieve any transcript for this video. Available transcripts: {str(available_transcripts)}. Please try a different video with captions enabled."
                )
        
        # Extract text from snippets
        transcript = " ".join([snippet.text for snippet in result.snippets])
        
        if not transcript.strip():
            raise HTTPException(
                status_code=400,
                detail="Transcript is empty. The video may not have valid captions."
            )
        
        return transcript
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error fetching transcript: {str(e)}")

def summarize_text(text: str) -> str:
    """Generate summary using OpenAI with smart chunking for long transcripts"""
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Calculate max input length (GPT-3.5-turbo has ~4096 token limit)
        # Roughly 1 token = 4 characters, leave room for system prompt and response
        max_chars = 12000  # ~3000 tokens for input
        
        # If transcript is too long, intelligently truncate
        if len(text) > max_chars:
            # Take beginning, middle, and end to capture full context
            chunk_size = max_chars // 3
            beginning = text[:chunk_size]
            middle_start = (len(text) - chunk_size) // 2
            middle = text[middle_start:middle_start + chunk_size]
            end = text[-chunk_size:]
            
            text_to_summarize = f"{beginning}\n\n[...content omitted...]\n\n{middle}\n\n[...content omitted...]\n\n{end}"
            transcript_note = f"\n\nNote: This is a long video ({len(text):,} characters). Summary based on key sections."
        else:
            text_to_summarize = text
            transcript_note = ""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes YouTube video transcripts. Provide a clear, comprehensive summary with key points and main takeaways."},
                {"role": "user", "content": f"Please summarize the following video transcript:\n\n{text_to_summarize}"}
            ],
            max_tokens=800,  # Increased for better summaries
            temperature=0.7
        )
        
        summary = response.choices[0].message.content
        return summary + transcript_note
        
    except Exception as e:
        # More detailed error handling
        error_msg = str(e)
        if "maximum context length" in error_msg.lower():
            raise HTTPException(
                status_code=400, 
                detail="Video is too long to summarize. Please try a shorter video (under 30 minutes)."
            )
        raise HTTPException(status_code=500, detail=f"Summarization failed: {error_msg}")

def create_vector_store(transcript: str, session_id: str):
    """Create vector store for RAG"""
    try:
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        documents = [Document(page_content=transcript)]
        texts = text_splitter.split_documents(documents)
        
        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        vectorstore = FAISS.from_documents(texts, embeddings)
        
        # Create conversational chain
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0.3,  # Lower temperature for more accurate answers
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),  # Retrieve more context
            memory=memory,
            return_source_documents=True
        )
        
        # Store in session
        video_sessions[session_id] = {
            "vectorstore": vectorstore,
            "qa_chain": qa_chain,
            "transcript": transcript
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vector store creation failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "YouTube Video Summarizer API", "status": "active"}

@app.post("/api/summarize")
async def summarize_video(request: VideoRequest):
    """Summarize YouTube video and prepare for Q&A"""
    try:
        # Extract video ID
        video_id = extract_video_id(request.video_url)
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        # Get transcript
        transcript = get_transcript(video_id)
        
        # Generate summary
        summary = summarize_text(transcript)
        
        # Create session ID
        session_id = f"session_{video_id}_{len(video_sessions)}"
        
        # Create vector store for RAG
        create_vector_store(transcript, session_id)
        
        return {
            "summary": summary,
            "session_id": session_id,
            "video_id": video_id,
            "transcript_length": len(transcript)
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat_about_video(request: ChatRequest):
    """Answer questions about the video using RAG - fully context-aware"""
    try:
        if request.session_id not in video_sessions:
            raise HTTPException(status_code=404, detail="Session not found. Please summarize a video first.")

        session = video_sessions[request.session_id]
        qa_chain = session["qa_chain"]
        
        # Always use RAG chain for better context-aware answers
        # The chain has access to the full video transcript and can answer intelligently
        result = qa_chain({"question": request.question})
        answer = result["answer"]

        return ChatResponse(
            answer=answer,
            session_id=request.session_id
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.delete("/api/session/{session_id}")
async def clear_session(session_id: str):
    """Clear a session"""
    if session_id in video_sessions:
        del video_sessions[session_id]
        return {"message": "Session cleared successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "active_sessions": len(video_sessions)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
