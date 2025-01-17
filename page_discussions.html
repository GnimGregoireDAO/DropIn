<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="DAO Gnim Gregoire, Sarah Laroubi">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panneau de Discussions</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" target=_blank href="../Style/discussion.css">
</head>
<body>
    <div class="Bannière">
        <header>
            <h1><a target=_blank href="detailGroupe.html" class="suppression-style">Les skieurs de l'extreme</a></h1>
        </header>
    </div>
    <div class="Discussions container mt-5">
        <div id="message-container" class="conteneur-de-messages">
           
        </div>
        <div class="cote-gauche">
            <h2>Groupe(s)</h2>
            <input type="text" placeholder="Rechercher un groupe..." class="form-control mb-3">
            <ul class="list-group">
                <li class="list-group-item" id="option"><strong>Options</strong></li>
                <li class="list-group-item"><a target=_blank href="créer_groupe.php">Créer un groupe</a></li>
                <li class="list-group-item"><a target=_blank href="ajout_groupe.php">Ajouter membre</a></li>
                <li class="list-group-item"><a target=_blank href="gestionGroupe.php">Gérer le groupe</a></li>
                <li class="list-group-item"><a target=_blank href="detailGroupe.php">Détail du groupe</a></li>
            </ul>
        </div>
        <div class="conteneur-de-saisie mt-3">
            <div class="input-group">
                <button id="file-button" class="btn btn-secondary">📄</button>
                <input id="file-input" type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" title="Attach a file" class="form-control-file d-none">
                <input id="message-input" type="text" placeholder="Tapez votre message..." class="form-control">
                <button id="record-button" class="btn btn-secondary">🎤</button>
                <button id="poll-button" class="btn btn-secondary">📊</button>
                <span id="recording-indicator" class="ml-2" style="display: none;">Enregistrement... <span id="recording-timer">0:00</span></span>
                <button id="send-button" class="btn btn-primary">Envoyer</button>
            </div>
           
        </div>
    </div>
    <footer class="text-center mt-5">
        <p>2024 MGSE PRODUCTIONS</p>
    </footer>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        let mediaRecorder;
        let audioChunks = [];
        let recordingInterval;
        let recordingStartTime;

        document.getElementById('file-button').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });

        document.getElementById('record-button').addEventListener('click', function() {
            const recordingIndicator = document.getElementById('recording-indicator');
            const recordingTimer = document.getElementById('recording-timer');

            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                clearInterval(recordingInterval);
                recordingIndicator.style.display = 'none';
            } else {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.start();
                        recordingStartTime = Date.now();
                        recordingIndicator.style.display = 'inline';

                        recordingInterval = setInterval(() => {
                            const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000);
                            const minutes = Math.floor(elapsedTime / 60);
                            const seconds = elapsedTime % 60;
                            recordingTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        }, 1000);

                        mediaRecorder.addEventListener('dataavailable', event => {
                            audioChunks.push(event.data);
                        });

                        mediaRecorder.addEventListener('stop', () => {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                            audioChunks = [];
                            const audioUrl = URL.createObjectURL(audioBlob);
                            const audio = new Audio(audioUrl);
                            const messageContainer = document.getElementById('message-container');
                            const newMessage = document.createElement('div');
                            newMessage.classList.add('message', 'envoyé', 'vous');
                            newMessage.innerHTML = `
                                <span class="nom vous">Vous: </span>
                                <audio controls>
                                    <source src="${audioUrl}" type="audio/mpeg">
                                </audio>
                                <span class="heure">${new Date().toLocaleTimeString()}</span>
                            `;
                            messageContainer.appendChild(newMessage);
                            messageContainer.scrollTop = messageContainer.scrollHeight;
                        });
                    });
            }
        });

        document.getElementById('poll-button').addEventListener('click', function() {
            const pollQuestion = prompt("Entrez la question du sondage:");
            if (pollQuestion) {
                const pollOptions = [];
                for (let i = 0; i < 3; i++) {
                    const option = prompt(`Entrez l'option ${i + 1}:`);
                    if (option) {
                        pollOptions.push(option);
                    }
                }
                if (pollOptions.length > 0) {
                    const messageContainer = document.getElementById('message-container');
                    const newMessage = document.createElement('div');
                    newMessage.classList.add('message', 'envoyé', 'vous');
                    newMessage.innerHTML = `
                        <span class="nom vous">Vous :</span>
                        <p>${pollQuestion}</p>
                        ${pollOptions.map(option => `<button class="poll-option">${option}</button>`).join('')}
                        <span class="heure">${new Date().toLocaleTimeString()}</span>
                    `;
                    messageContainer.appendChild(newMessage);
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }
            }
        });

        function sendMessage() {
            const messageInput = document.getElementById('message-input');
            const fileInput = document.getElementById('file-input');
            const messageText = messageInput.value;
            const file = fileInput.files[0];
            const messageContainer = document.getElementById('message-container');
            const newMessage = document.createElement('div');
            newMessage.classList.add('message', 'envoyé', 'vous');

            if (messageText.trim() !== '') {
                newMessage.innerHTML = `
                    <span class="nom vous">Vous :</span>
                    <p>${messageText}</p>
                    <span class="heure">${new Date().toLocaleTimeString()}</span>
                `;
            }

            if (file) {
                const fileReader = new FileReader();
                fileReader.onload = function(e) {
                    let fileContent = '';
                    if (file.type.startsWith('image/')) {
                        fileContent = `<img src="${e.target.result}" alt="image" class="message-image">`;
                    } else if (file.type.startsWith('video/')) {
                        fileContent = `<video controls class="message-video"><source src="${e.target.result}" type="${file.type}"></video>`;
                    } else if (file.type.startsWith('audio/')) {
                        fileContent = `<audio controls class="message-audio"><source src="${e.target.result}" type="${file.type}"></audio>`;
                    } else {
                        fileContent = `<a target=_blank href="${e.target.result}" download="${file.name}">${file.name}</a>`;
                    }
                    newMessage.innerHTML += fileContent;
                    newMessage.innerHTML += `<span class="heure">${new Date().toLocaleTimeString()}</span>`;
                    messageContainer.appendChild(newMessage);
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                };
                fileReader.readAsDataURL(file);
            } else if (messageText.trim() !== '') {
                newMessage.innerHTML += `<span class="heure">${new Date().toLocaleTimeString()}</span>`;
                messageContainer.appendChild(newMessage);
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }

            messageInput.value = '';
            fileInput.value = '';
        }

        document.getElementById('send-button').addEventListener('click', sendMessage);
        document.getElementById('message-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    </script>
</body>
</html>
