const ws = new WebSocket('ws://localhost:3001');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function addMessage(content, isReceived = false, timestamp = new Date()) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'reçu' : 'envoyé'}`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = content;
    
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'heure';
    timestampSpan.textContent = new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestampSpan);
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        ws.send(JSON.stringify({ message }));
        addMessage(message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'adminResponse') {
        addMessage(data.message, true, data.timestamp);
    }
};

// Typing indicator
let typingTimeout;
messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    ws.send(JSON.stringify({ type: 'typing' }));
    typingTimeout = setTimeout(() => {
        ws.send(JSON.stringify({ type: 'stopTyping' }));
    }, 3000);
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'adminResponse') {
        addMessage(data.message, true, data.timestamp);
    } else if (data.type === 'typing') {
        showTypingIndicator();
    } else if (data.type === 'stopTyping') {
        hideTypingIndicator();
    }
});

function showTypingIndicator() {
    let typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'typing-indicator';
        typingIndicator.textContent = 'L\'autre personne est en train d\'écrire...';
        messageContainer.appendChild(typingIndicator);
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Multimedia messages
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*,audio/*,video/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            ws.send(JSON.stringify({ type: 'multimedia', content: reader.result, fileType: file.type }));
            addMultimediaMessage(reader.result, file.type);
        };
        reader.readAsDataURL(file);
    }
});

function addMultimediaMessage(content, fileType, isReceived = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'reçu' : 'envoyé'}`;
    
    let mediaElement;
    if (fileType.startsWith('image/')) {
        mediaElement = document.createElement('img');
        mediaElement.src = content;
        mediaElement.className = 'message-image';
    } else if (fileType.startsWith('audio/')) {
        mediaElement = document.createElement('audio');
        mediaElement.src = content;
        mediaElement.controls = true;
    } else if (fileType.startsWith('video/')) {
        mediaElement = document.createElement('video');
        mediaElement.src = content;
        mediaElement.controls = true;
        mediaElement.className = 'message-video';
    }

    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'heure';
    timestampSpan.textContent = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.appendChild(mediaElement);
    messageDiv.appendChild(timestampSpan);
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const multimediaButton = document.createElement('button');
multimediaButton.textContent = 'Envoyer un fichier';
multimediaButton.className = 'btn btn-secondary';
multimediaButton.addEventListener('click', () => {
    fileInput.click();
});
document.querySelector('.conteneur-de-saisie').appendChild(multimediaButton);

// Message reactions
function addReaction(messageDiv, reaction) {
    const reactionSpan = document.createElement('span');
    reactionSpan.className = 'reaction';
    reactionSpan.textContent = reaction;
    messageDiv.appendChild(reactionSpan);
}

messageContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('message')) {
        const reaction = prompt('Réagir avec: (👍, ❤️, 😂, 😮, 😢, 😡)');
        if (reaction) {
            addReaction(e.target, reaction);
        }
    }
});

// Desktop notifications
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function notifyNewMessage(content) {
    if (Notification.permission === 'granted') {
        new Notification('Nouveau message', {
            body: content,
            icon: '../assets/images/GDG_PRODUCTIONS.png'
        });
    }
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'adminResponse') {
        addMessage(data.message, true, data.timestamp);
        notifyNewMessage(data.message);
    } else if (data.type === 'typing') {
        showTypingIndicator();
    } else if (data.type === 'stopTyping') {
        hideTypingIndicator();
    } else if (data.type === 'multimedia') {
        addMultimediaMessage(data.content, data.fileType, true);
        notifyNewMessage('Nouveau fichier reçu');
    } else if (data.type === 'video') {
        addMultimediaMessage(data.content, 'video/mp4', true);
        notifyNewMessage('Nouvelle vidéo reçue');
    }
});

// Keyboard navigation for interactive elements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = document.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.shiftKey) { // shift + tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Ensure ARIA attributes are set dynamically where necessary
const interactiveElements = document.querySelectorAll('button, input, [role="button"], [role="textbox"]');
interactiveElements.forEach(element => {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', element.innerText || element.placeholder || 'Interactive element');
    }
});

// Dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = 'Toggle Dark Mode';
darkModeToggle.className = 'btn btn-dark';
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
document.querySelector('.conteneur-de-saisie').appendChild(darkModeToggle);
