// API Configuration
// For local development (recommended - no YouTube IP blocking):
const API_BASE_URL = 'http://localhost:8000';

// For production deployment (YouTube blocks cloud provider IPs):
// const API_BASE_URL = 'https://youtube-video-summary-rxc7.onrender.com';

// State management
let currentSessionId = null;

// DOM Elements
const videoUrlInput = document.getElementById('videoUrl');
const summarizeBtn = document.getElementById('summarizeBtn');
const newVideoBtn = document.getElementById('newVideoBtn');
const questionInput = document.getElementById('questionInput');
const sendBtn = document.getElementById('sendBtn');

const inputSection = document.getElementById('inputSection');
const summarySection = document.getElementById('summarySection');
const chatSection = document.getElementById('chatSection');
const errorMessage = document.getElementById('errorMessage');

const summaryContent = document.getElementById('summaryContent');
const videoId = document.getElementById('videoId');
const transcriptLength = document.getElementById('transcriptLength');
const videoThumbnail = document.getElementById('videoThumbnail');
const chatMessages = document.getElementById('chatMessages');

// Event Listeners
summarizeBtn.addEventListener('click', handleSummarize);
newVideoBtn.addEventListener('click', resetApp);
sendBtn.addEventListener('click', handleSendQuestion);

videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSummarize();
});

questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendQuestion();
});

// Utility Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const loader = button.querySelector('.loader');
    
    if (isLoading) {
        btnText.style.display = 'none';
        loader.style.display = 'block';
        button.disabled = true;
    } else {
        btnText.style.display = 'block';
        loader.style.display = 'none';
        button.disabled = false;
    }
}

function extractVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

function createThumbnail(videoId) {
    return `<img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                 onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'" 
                 alt="Video thumbnail">`;
}

// Main Functions
async function handleSummarize() {
    const url = videoUrlInput.value.trim();
    
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }
    
    const extractedVideoId = extractVideoId(url);
    if (!extractedVideoId) {
        showError('Invalid YouTube URL. Please check and try again.');
        return;
    }
    
    setLoading(summarizeBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ video_url: url })
        });
        
        if (!response.ok) {
            const error = await response.json();
            
            // Provide helpful messages for common errors
            let errorMessage = error.detail || 'Failed to summarize video';
            
            if (errorMessage.includes('too long')) {
                errorMessage += '\n\nTip: Try a video under 30 minutes for best results.';
            } else if (errorMessage.includes('transcript')) {
                errorMessage += '\n\nMake sure the video has captions/subtitles enabled.';
            } else if (errorMessage.includes('api_key')) {
                errorMessage = 'OpenAI API key is not configured. Please check backend .env file.';
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Store session ID
        currentSessionId = data.session_id;
        
        // Display results
        displaySummary(data);
        
        // Show sections
        summarySection.style.display = 'block';
        chatSection.style.display = 'block';
        
        // Scroll to summary
        summarySection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    } finally {
        setLoading(summarizeBtn, false);
    }
}

function displaySummary(data) {
    // Set video info
    videoId.textContent = data.video_id;
    transcriptLength.textContent = data.transcript_length.toLocaleString();
    videoThumbnail.innerHTML = createThumbnail(data.video_id);
    
    // Set summary content
    summaryContent.innerHTML = `<p>${data.summary.replace(/\n/g, '<br>')}</p>`;
}

async function handleSendQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) {
        showError('Please enter a question');
        return;
    }
    
    if (!currentSessionId) {
        showError('Please summarize a video first');
        return;
    }
    
    // Add user message to chat
    addMessage(question, 'user');
    questionInput.value = '';
    
    setLoading(sendBtn, true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: currentSessionId,
                question: question
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to get answer');
        }
        
        const data = await response.json();
        
        // Add bot response to chat
        addMessage(data.answer, 'bot');
        
    } catch (error) {
        showError(error.message);
        addMessage('Sorry, I encountered an error processing your question. Please try again.', 'bot');
        console.error('Error:', error);
    } finally {
        setLoading(sendBtn, false);
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Add avatar for bot messages
    if (sender === 'bot') {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423l.394-1.933.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        messageDiv.appendChild(avatarDiv);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function resetApp() {
    // Clear session
    if (currentSessionId) {
        fetch(`${API_BASE_URL}/api/session/${currentSessionId}`, {
            method: 'DELETE'
        }).catch(err => console.error('Error clearing session:', err));
    }
    
    currentSessionId = null;
    
    // Reset UI
    videoUrlInput.value = '';
    questionInput.value = '';
    summarySection.style.display = 'none';
    chatSection.style.display = 'none';
    
    // Clear chat messages except welcome message
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423l.394-1.933.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="message-content">
                <p>Hello! I've analyzed the video. Ask me anything!</p>
            </div>
        </div>
    `;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
console.log('YouTube Video Summarizer loaded');
