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

## 🚀 Quick Start (Recommended)

⚠️ **Important**: YouTube blocks transcript requests from cloud providers (AWS, Render, Netlify, etc.). For best results, **run the backend locally**.

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

**Start Backend (Local - Recommended):**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at `http://localhost:8000`

**Open Frontend:**
- Simply open `frontend/index.html` in your browser (double-click the file)
- Or serve it with Python:
```bash
cd frontend
python -m http.server 3000
```

Then visit `http://localhost:3000` in your browser.

## 💡 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL
2. **Click "Summarize"**: Get an AI-generated summary
3. **Ask Questions**: Use the chat to ask about video content
4. **New Video**: Click "New Video" to analyze another

## 🌐 Deployment

### ⚠️ Important Note About Cloud Deployment

**YouTube blocks transcript API requests from cloud providers** (Render, AWS, Google Cloud, etc.) to prevent scraping. This means:
- ✅ **Local backend works perfectly** with all videos
- ❌ **Cloud-deployed backends** will get IP blocked by YouTube for most videos

### Option 1: Local Backend (Recommended)

**Best for**: Reliable functionality, no IP blocking issues

1. Keep backend running locally on your machine
2. Deploy only the frontend to any static hosting (Netlify, Vercel, GitHub Pages)
3. Update `frontend/script.js` to use your local IP when testing

### Option 2: Full Cloud Deployment (Limited Functionality)

**Note**: This will work for deployment/portfolio demonstration, but many videos will fail due to YouTube IP blocking.

#### Deploy Backend to Render

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
| "Could not retrieve transcript" with YouTube IP blocking error | **This is normal with cloud deployment**. YouTube blocks cloud IPs. Use local backend instead. |
| "Could not fetch transcript" | Video may not have captions, is private/age-restricted, or you're using cloud-deployed backend |
| "Summarization failed" | Check OpenAI API key and credits |
| CORS errors | Backend CORS is enabled for all origins - check console |
| Session not found | Sessions are in-memory; restart backend to clear |
| Backend not responding | Check if backend is running with `uvicorn main:app --reload --host 0.0.0.0 --port 8000` |

### Common Commands

**Start Local Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Serve Frontend Locally:**
```bash
cd frontend
python -m http.server 3000
# Visit http://localhost:3000
```

**Or just open the file:**
- Double-click `frontend/index.html` in File Explorer

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
