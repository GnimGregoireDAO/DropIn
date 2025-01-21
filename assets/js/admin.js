
const ws = new WebSocket('ws://localhost:3000?admin=true');
const clientsList = document.getElementById('clients-list');
const chatMessages = document.getElementById('chat-messages');
const adminInput = document.getElementById('admin-input');
const adminSend = document.getElementById('admin-send');
const notificationSound = document.getElementById('notification-sound');
=======
document.addEventListener('DOMContentLoaded', () => {
    // Vérification de la connexion admin
    if (!localStorage.getItem('adminConnected') && !window.location.href.includes('login.html')) {
        window.location.href = './login.html';
        return;
    }


    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;


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
=======
            // Vérification simple (à remplacer par une vraie authentification)
            if (username === "admin" && password === "dropin2024") {
                localStorage.setItem('adminConnected', 'true');
                window.location.href = window.location.href.replace('login.html', 'admin.html');
            } else {
                alert('Identifiants incorrects');
            }
        });

    }

    // Gestion de l'interface admin
    const adminInput = document.getElementById('admin-input');
    const adminSend = document.getElementById('admin-send');
    const clientsList = document.getElementById('clients-list');
    const chatMessages = document.getElementById('chat-messages');

    if (adminInput && adminSend) {
        const ws = new WebSocket('ws://localhost:3001?admin=true');
        let selectedClient = null;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'newMessage') {
                handleNewMessage(data);
                notifyNewMessage(data);
            }
        };


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
=======
        function handleNewMessage(data) {
            // Ajouter le client à la liste s'il n'existe pas
            if (!document.getElementById(`client-${data.clientId}`)) {
                const clientDiv = document.createElement('div');
                clientDiv.id = `client-${data.clientId}`;
                clientDiv.className = 'client-item p-2 border-bottom';
                clientDiv.textContent = `Client ${data.clientId.slice(0, 8)}...`;
                clientDiv.onclick = () => selectClient(data.clientId);
                clientsList.appendChild(clientDiv);
            }


            // Afficher le message si c'est le client sélectionné
            if (selectedClient === data.clientId) {
                appendMessage(data);
            }
        }

        function selectClient(clientId) {
            selectedClient = clientId;
            chatMessages.innerHTML = '';
            // Charger l'historique des messages pour ce client
        }

        function appendMessage(data) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message client-message';
            messageDiv.innerHTML = `
                <div class="message-time">${new Date(data.timestamp).toLocaleTimeString()}</div>
                <div class="message-content">${data.message}</div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        adminSend.onclick = () => {
            if (!selectedClient || !adminInput.value.trim()) return;

            ws.send(JSON.stringify({
                recipientId: selectedClient,
                message: adminInput.value
            }));

            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message admin-message';
            messageDiv.innerHTML = `
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
                <div class="message-content">${adminInput.value}</div>
            `;
            chatMessages.appendChild(messageDiv);
            adminInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
    }

    notificationSound.play();
}
=======
});

