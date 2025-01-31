// DOM Elements
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const clearButton = document.getElementById('clear-btn');
const exitButton = document.getElementById('exit-btn');
const typingIndicator = document.getElementById('typing-indicator');

// API Configuration
const API_URL = 'https://gemvision.onrender.com';

// State
let currentFile = null;
let isProcessing = false;

// Helper Functions
function addMessage(content, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    // Create message content
    const messageContent = document.createElement('span');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);
    
    wrapper.appendChild(messageDiv);
    chatContainer.appendChild(wrapper);
    
    // Ensure smooth scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
}

function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
}

function disableInput() {
    messageInput.disabled = true;
    sendButton.disabled = true;
    isProcessing = true;
}

function enableInput() {
    messageInput.disabled = false;
    sendButton.disabled = false;
    isProcessing = false;
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isProcessing) return;

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';
    
    // Show typing indicator and disable input
    showTypingIndicator();
    disableInput();

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
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.response) {
            addMessage(data.response);
        } else {
            throw new Error('No response from the bot');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('I apologize, but I\'m having trouble connecting to the server. Please try again in a moment.');
    } finally {
        hideTypingIndicator();
        enableInput();
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    fileName.textContent = file.name;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
        currentFile = e.target.result;
        addMessage('Image uploaded successfully! You can now ask questions about the image.', false);
    };
    reader.onerror = () => {
        addMessage('Error uploading image. Please try again.', false);
    };
    reader.readAsDataURL(file);
});

clearButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat?')) {
        chatContainer.innerHTML = '';
        currentFile = null;
        fileName.textContent = '';
        addMessage('Chat cleared. How can I help you?', false);
    }
});

exitButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to exit?')) {
        addMessage('Thank you for using GemVision AI. Goodbye!', false);
        setTimeout(() => {
            window.location.href = 'https://malik-0032.github.io/';
        }, 2000);
    }
});

// Initial welcome message
addMessage('👋 Welcome to GemVision AI! I\'m powered by Google\'s Gemini Pro Vision model. I can help you analyze images and answer your questions. How can I assist you today?');