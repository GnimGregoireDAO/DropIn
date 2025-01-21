const ws = new WebSocket('ws://localhost:3000?admin=true');
const clientsList = document.getElementById('clients-list');
const chatMessages = document.getElementById('chat-messages');
const adminInput = document.getElementById('admin-input');
const adminSend = document.getElementById('admin-send');
const notificationSound = document.getElementById('notification-sound');

let currentClient = null;
const conversations = new Map();

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'newMessage') {
        // Ajouter à la conversation
        if (!conversations.has(data.clientId)) {
            conversations.set(data.clientId, []);
            addClientToList(data.clientId);
        }
        conversations.get(data.clientId).push(data);

        // Si c'est le client actuel, afficher le message
        if (currentClient === data.clientId) {
            displayMessage(data);
        }

        // Notification
        notifyNewMessage(data);
    }
};

function addClientToList(clientId) {
    const clientDiv = document.createElement('div');
    clientDiv.className = 'client-item p-2 border-bottom';
    clientDiv.textContent = `Client ${clientId.slice(0, 8)}...`;
    clientDiv.onclick = () => loadConversation(clientId);
    clientsList.appendChild(clientDiv);
}

function loadConversation(clientId) {
    currentClient = clientId;
    chatMessages.innerHTML = '';
    const messages = conversations.get(clientId) || [];
    messages.forEach(displayMessage);
}

function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${data.isAdmin ? 'admin-message' : 'client-message'}`;
    messageDiv.innerHTML = `
        <div class="message-time">${new Date(data.timestamp).toLocaleTimeString()}</div>
        <div class="message-content">${data.message}</div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

adminSend.onclick = () => {
    if (!currentClient || !adminInput.value.trim()) return;

    ws.send(JSON.stringify({
        recipientId: currentClient,
        message: adminInput.value,
        isAdmin: true
    }));

    displayMessage({
        message: adminInput.value,
        isAdmin: true,
        timestamp: new Date().toISOString()
    });

    adminInput.value = '';
};

// Demander la permission pour les notifications
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function notifyNewMessage(data) {
    if (Notification.permission === 'granted') {
        new Notification('Nouveau message', {
            body: `Client ${data.clientId.slice(0, 8)}: ${data.message}`,
            icon: '../assets/images/GDG_PRODUCTIONS.png'
        });
    }
    notificationSound.play();
}
