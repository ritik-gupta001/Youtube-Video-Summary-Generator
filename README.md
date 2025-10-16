# YouTube Video Summarizer with RAG Chat

A full-stack web application that summarizes YouTube videos and provides an AI-powered chat interface to ask questions about the video content using RAG (Retrieval Augmented Generation).

## Features

- 🎥 **Video Summarization**: Extract and summarize YouTube video transcripts
- 💬 **RAG-based Chat**: Ask questions about video content with context-aware responses
- 🚀 **FastAPI Backend**: High-performance Python backend
- 🎨 **Modern UI**: Clean, responsive HTML/CSS/JavaScript frontend
- 🤖 **OpenAI Integration**: Powered by GPT-3.5-turbo for intelligent responses
- 📊 **Vector Search**: FAISS for efficient semantic search
- 🔄 **Session Management**: Multiple video sessions support

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

### Backend Deployment

1. Use a production ASGI server (Gunicorn + Uvicorn)
2. Set up proper environment variables
3. Use a PostgreSQL/Redis for session storage
4. Deploy to platforms like:
   - Heroku
   - AWS (ECS, Lambda)
   - Google Cloud Run
   - DigitalOcean

### Frontend Deployment

1. Deploy static files to:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3 + CloudFront

2. Update API_BASE_URL in `script.js` to production backend URL

## Security Considerations

- Never commit `.env` file with API keys
- Use HTTPS in production
- Implement rate limiting
- Add authentication for production use
- Validate and sanitize all inputs
- Use a proper database for session storage

## License

MIT License - Feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- OpenAI for GPT-3.5-turbo
- LangChain for RAG framework
- FastAPI for the excellent web framework
- YouTube Transcript API developers

## Contact

For questions or support, please open an issue on GitHub.
