# YouTube Video Summarizer with RAG Chat

A full-stack web application that summarizes YouTube videos and provides an AI-powered chat interface to ask questions about the video content using RAG (Retrieval Augmented Generation).

## ✨ Features

- 🎥 **Video Summarization**: Extract and summarize YouTube video transcripts
- 💬 **Advanced RAG Chat**: 
  - Context-aware responses using video transcript
  - Intelligent retrieval of top 5 most relevant chunks
  - Conversation memory for follow-up questions
  - Precise answers with optimized temperature settings
- 🚀 **FastAPI Backend**: High-performance Python backend
- 🎨 **Modern UI**: Clean, responsive design with elegant brown theme and animated background
- 🤖 **OpenAI Integration**: Powered by GPT-3.5-turbo
- 📊 **Vector Search**: FAISS for efficient semantic search
- 🔄 **Session Management**: Multiple video sessions support
- 🌍 **Multi-language Support**: Supports transcripts in multiple languages

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain**: Framework for LLM applications
- **OpenAI**: GPT-3.5-turbo for summarization and chat
- **FAISS**: Vector database for RAG
- **youtube-transcript-api**: Extract video transcripts

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **Vanilla JavaScript**: No framework dependencies
- **Animated UI**: Morphing shapes and smooth transitions

## 📋 Prerequisites

- Python 3.8 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ritik-gupta001/Youtube-Video-Summary-Generator.git
cd Youtube-Video-Summary-Generator
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Run the Application

**Start Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Open Frontend:**
- Open `frontend/index.html` in your browser
- Or serve it with Python:
```bash
cd frontend
python -m http.server 3000
```

Visit `http://localhost:3000` in your browser.

## 💡 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL
2. **Click "Summarize"**: Get an AI-generated summary
3. **Ask Questions**: Use the chat to ask about video content
4. **New Video**: Click "New Video" to analyze another

## 🌐 Deployment

### Render (Backend)

1. Create account at [Render](https://render.com/)
2. New Web Service → Connect GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy!

### Netlify (Frontend)

1. Create account at [Netlify](https://netlify.com/)
2. Import project from GitHub
3. Configure:
   - **Publish Directory**: `frontend`
4. Update `frontend/script.js` with your Render backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend.onrender.com';
   ```
5. Deploy!

**Note**: YouTube may block requests from some cloud IPs. Local development is recommended for best results.

## 📡 API Endpoints

### `POST /api/summarize`
Summarize a YouTube video
```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### `POST /api/chat`
Ask questions about the video
```json
{
  "session_id": "session_VIDEO_ID_0",
  "question": "What is the main topic?"
}
```

### `DELETE /api/session/{session_id}`
Clear a session

### `GET /api/health`
Health check

## ⚙️ Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Frontend API URL
Edit `frontend/script.js` line 3:
```javascript
const API_BASE_URL = 'http://localhost:8000';  // Local
// const API_BASE_URL = 'https://your-backend.onrender.com';  // Production
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Could not fetch transcript" | Video may not have captions or is private/restricted |
| "Summarization failed" | Check OpenAI API key and credits |
| CORS errors | Backend CORS is enabled for all origins - check console |
| Session not found | Sessions are in-memory; restart backend to clear |

## 🔒 Security Notes

- Never commit `.env` files
- Use HTTPS in production
- Implement rate limiting for production
- Add authentication for public deployments
- Validate all inputs

## 📝 License

MIT License - Free to use for learning and development

## 🙏 Acknowledgments

- OpenAI for GPT-3.5-turbo
- LangChain for RAG framework
- FastAPI community
- YouTube Transcript API developers
