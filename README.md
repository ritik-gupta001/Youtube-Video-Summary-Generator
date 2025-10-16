# YouTube Video Summarizer with RAG Chat

A full-stack web application that summarizes YouTube videos and provides an AI-powered chat interface to ask questions about the video content using RAG (Retrieval Augmented Generation).

🌐 **Live Demo**: [Deploy on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/ritik-gupta001/Youtube-Video-Summary-Generator)



https://github.com/user-attachments/assets/07ae45a0-79af-4991-ae8c-4ca380d0354d


## Features

- 🎥 **Video Summarization**: Extract and summarize YouTube video transcripts
- 💬 **Advanced RAG Chat**: 
  - **Context-Aware**: Always uses video transcript for accurate, relevant answers
  - **Intelligent Retrieval**: Retrieves top 5 most relevant chunks from transcript
  - **Conversation Memory**: Remembers chat history for follow-up questions
  - **Precise Answers**: Lower temperature (0.3) for more accurate responses
- 🚀 **FastAPI Backend**: High-performance Python backend
- 🎨 **Modern UI**: Clean, responsive HTML/CSS/JavaScript frontend with light teal/yellow theme
- 🤖 **OpenAI Integration**: Powered by GPT-3.5-turbo for intelligent responses
- 📊 **Vector Search**: FAISS for efficient semantic search
- 🔄 **Session Management**: Multiple video sessions support
- 🌍 **Multi-language Support**: Supports transcripts in multiple languages

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain**: Framework for LLM applications
- **OpenAI**: GPT-3.5-turbo for summarization and chat
- **FAISS**: Vector database for RAG
- **youtube-transcript-api**: Extract video transcripts

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with modern gradients and animations
- **Vanilla JavaScript**: No framework dependencies
- **Fetch API**: REST API communication

## Installation

### Prerequisites
- Python 3.8 or higher
- OpenAI API key
- Node.js (optional, for serving frontend)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file:
```bash
copy .env.example .env
```

6. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

7. Run the backend server:
```bash
python main.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in a web browser, or serve it using a simple HTTP server:

Using Python:
```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Usage

1. **Enter YouTube URL**: Paste any YouTube video URL in the input field
2. **Get Summary**: Click "Summarize" to generate a video summary
3. **Ask Questions**: Use the chat interface to ask questions about the video
4. **Start Over**: Click "New Video" to analyze a different video

## API Endpoints

### POST `/api/summarize`
Summarize a YouTube video and create a chat session.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "summary": "Video summary text...",
  "session_id": "session_VIDEO_ID_0",
  "video_id": "VIDEO_ID",
  "transcript_length": 15000
}
```

### POST `/api/chat`
Ask questions about the video using RAG.

**Request:**
```json
{
  "session_id": "session_VIDEO_ID_0",
  "question": "What is the main topic?"
}
```

**Response:**
```json
{
  "answer": "The main topic is...",
  "session_id": "session_VIDEO_ID_0"
}
```

### DELETE `/api/session/{session_id}`
Clear a session and free up resources.

### GET `/api/health`
Check API health status.

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Frontend Configuration

Edit `script.js` to change the API base URL:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## Troubleshooting

### Common Issues

1. **"Could not fetch transcript"**
   - Video may not have captions/subtitles
   - Video might be private or age-restricted
   - Try a different video

2. **"Summarization failed"**
   - Check your OpenAI API key
   - Ensure you have API credits
   - Check internet connection

3. **CORS errors**
   - Backend CORS is configured for all origins
   - If issues persist, check browser console

4. **Session not found**
   - Sessions are stored in memory
   - Restart the backend server to clear sessions

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Add new UI components in `index.html` and logic in `script.js`
3. **Styling**: Update `styles.css` for visual changes

### Testing

Test the API using curl:
```bash
curl -X POST "http://localhost:8000/api/summarize" \
     -H "Content-Type: application/json" \
     -d '{"video_url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Deployment

### Option 1: Local Development (Recommended for Testing)

**Best for**: Testing, development, avoiding YouTube IP blocking issues

#### Quick Start:

1. **Start Backend:**
   ```bash
   cd backend
   python main.py
   ```

2. **Open Frontend:**
   - Simply open `frontend/index.html` in your browser
   - Or double-click the HTML file

3. **You're ready!** Backend runs at `http://localhost:8000`

#### Why Local?
✅ No YouTube IP blocking (cloud providers often get blocked)  
✅ Faster response times  
✅ Free - no hosting costs  
✅ Easy debugging with live logs

---

### Option 2: Production Deployment (Netlify + Render)

**Best for**: Live demos, sharing with others, portfolio projects

#### Frontend Deployment (Netlify)

1. **Go to [Netlify](https://www.netlify.com/)** and sign in with GitHub

2. **Click "Add new site" → "Import an existing project"**

3. **Select your repository**: `Youtube-Video-Summary-Generator`

4. **Configure settings:**
   - Publish directory: `frontend`
   - Build command: (leave empty)

5. **Deploy!** Your frontend will be live at `https://your-site.netlify.app`

#### Backend Deployment (Render)

1. **Go to [Render](https://render.com/)** and sign in with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your repository**: `Youtube-Video-Summary-Generator`

4. **Configure settings:**
   - Name: `youtube-summarizer-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variable:**
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-api-key-here`

6. **Deploy!** Copy your backend URL (e.g., `https://your-app.onrender.com`)

#### Connect Frontend to Backend

After deploying both:

1. **Update `frontend/script.js`** line 3:
   ```javascript
   const API_BASE_URL = 'https://your-backend.onrender.com';
   ```

2. **Commit and push:**
   ```bash
   git add frontend/script.js
   git commit -m "Update API URL for production"
   git push
   ```

3. **Netlify auto-deploys!** Your app is now live!

#### Important Notes:

⚠️ **YouTube IP Blocking**: Some videos may not work on Render due to YouTube blocking cloud provider IPs. For best results, use local development.

💡 **Render Free Tier**: Backend may sleep after 15 minutes of inactivity. First request will take ~30 seconds to wake up.

---

### Environment Variables

**Backend (.env for local):**
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Render (for production):**
Add `OPENAI_API_KEY` in environment variables section

**Frontend:**
- Local: Uses `http://localhost:8000` (default)
- Production: Update to your Render backend URL

## Security Considerations

- Never commit `.env` file with API keys
- Use HTTPS in production
- Implement rate limiting
- Add authentication for production use
- Validate and sanitize all inputs
- Use a proper database for session storage
- Set up CORS properly for production domains

## License

MIT License - Feel free to use this project for learning and development.

## Author

**Ritik Kumar Gupta**

## Acknowledgments

- OpenAI for GPT-3.5-turbo
- LangChain for RAG framework
- FastAPI for the excellent web framework
- YouTube Transcript API developers
