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
    const notificationSound = document.getElementById('notification-sound');

    if (adminInput && adminSend) {
        const ws = new WebSocket('ws://localhost:3001?admin=true');
        let selectedClient = null;
        let typingTimeout;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'newMessage') {
                handleNewMessage(data);
                notifyNewMessage(data);
            } else if (data.type === 'typing') {
                showTypingIndicator(data.clientId);
            } else if (data.type === 'stopTyping') {
                hideTypingIndicator();
            } else if (data.type === 'multimedia') {
                addMultimediaMessage(data.content, data.fileType, true);
                notifyNewMessage('Nouveau fichier reçu');
            } else if (data.type === 'video') {
                addMultimediaMessage(data.content, 'video/mp4', true);
                notifyNewMessage('Nouvelle vidéo reçue');
            }
        };

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

        adminInput.addEventListener('input', () => {
            clearTimeout(typingTimeout);
            ws.send(JSON.stringify({
                type: 'typing',
                clientId: selectedClient
            }));
            typingTimeout = setTimeout(() => {
                ws.send(JSON.stringify({
                    type: 'stopTyping',
                    clientId: selectedClient
                }));
            }, 3000);
        });

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

        function showTypingIndicator(clientId) {
            const typingIndicator = document.getElementById('typing-indicator');
            if (!typingIndicator) {
                const indicator = document.createElement('div');
                indicator.id = 'typing-indicator';
                indicator.className = 'typing-indicator';
                indicator.textContent = `Client ${clientId.slice(0, 8)}... est en train d'écrire...`;
                chatMessages.appendChild(indicator);
            }
        }

        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        function notifyNewMessage(data) {
            notificationSound.play();
            if (Notification.permission === 'granted') {
                new Notification('Nouveau message de Client ' + data.clientId.slice(0, 8), {
                    body: data.message,
                    icon: '../assets/images/GDG_PRODUCTIONS.png'
                });
            }
        }

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
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
            messageDiv.className = `chat-message ${isReceived ? 'client-message' : 'admin-message'}`;
            
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
            timestampSpan.className = 'message-time';
            timestampSpan.textContent = new Date().toLocaleTimeString();

            messageDiv.appendChild(mediaElement);
            messageDiv.appendChild(timestampSpan);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        const multimediaButton = document.createElement('button');
        multimediaButton.textContent = 'Envoyer un fichier';
        multimediaButton.className = 'btn btn-secondary';
        multimediaButton.addEventListener('click', () => {
            fileInput.click();
        });
        document.querySelector('.input-group').appendChild(multimediaButton);

        // Message reactions
        function addReaction(messageDiv, reaction) {
            const reactionSpan = document.createElement('span');
            reactionSpan.className = 'reaction';
            reactionSpan.textContent = reaction;
            messageDiv.appendChild(reactionSpan);
        }

        chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-message')) {
                const reaction = prompt('Réagir avec: (👍, ❤️, 😂, 😮, 😢, 😡)');
                if (reaction) {
                    addReaction(e.target, reaction);
                }
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
    }
});
