const ws = new WebSocket('ws://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function addMessage(content, isReceived = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'reçu' : 'envoyé'}`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = content;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'heure';
    timestamp.textContent = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestamp);
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
        addMessage(data.message, true);
    }
};
