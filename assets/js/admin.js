document.addEventListener('DOMContentLoaded', () => {
    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Vérification simple (à remplacer par une vraie authentification)
            if (username === "admin" && password === "dropin2024") {
                localStorage.setItem('adminConnected', 'true');
                window.location.href = 'admin.html';
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
});
