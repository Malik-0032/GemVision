// DOM Elements
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const clearButton = document.getElementById('clear-btn');
const exitButton = document.getElementById('exit-btn');

// API Configuration
const API_URL = 'https://gemvision.onrender.com';

// State
let currentFile = null;

// Helper Functions
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';

    try {
        const requestBody = {
            message: message,
            image_data: currentFile
        };

        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (response.ok) {
            addMessage(data.response);
        } else {
            addMessage('Error: ' + data.detail);
        }
    } catch (error) {
        addMessage('Error: Could not connect to the server');
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        currentFile = e.target.result;
    };
    reader.readAsDataURL(file);
});

clearButton.addEventListener('click', () => {
    chatContainer.innerHTML = '';
    currentFile = null;
    fileName.textContent = '';
});

exitButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit?')) {
        window.close();
        // Alternatively, redirect to a thank you page
        // window.location.href = '/thank-you';
    }
});

// Initial welcome message
addMessage('👋 Welcome! How can I help you today?');
