const express = require('express');
const { Server } = require('ws');
const uuid = require('uuid');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3001; // Changé de 3000 à 3001

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

const server = app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

const wss = new Server({ server });

const clients = new Map();
const adminConnections = new Set();

wss.on('connection', (ws, req) => {
  const isAdmin = req.url.includes('admin=true');
  const clientId = uuid.v4();

  if (isAdmin) {
    adminConnections.add(ws);
    console.log('Admin connecté');
  } else {
    clients.set(clientId, {
      ws,
      messages: []
    });
    console.log(`Nouveau client connecté: ${clientId}`);
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (isAdmin) {
      // Envoi de la réponse admin au client spécifique
      const targetClient = clients.get(data.recipientId);
      if (targetClient) {
        targetClient.ws.send(JSON.stringify({
          type: 'adminResponse',
          message: data.message
        }));
      }
    } else {
      // Stockage du message client
      const clientData = clients.get(clientId);
      clientData.messages.push(data.message);

      // Notification aux admins
      adminConnections.forEach(adminWs => {
        adminWs.send(JSON.stringify({
          type: 'newMessage',
          clientId: clientId,
          message: data.message,
          timestamp: new Date().toISOString()
        }));
      });
    }
  });

  ws.on('close', () => {
    if (isAdmin) {
      adminConnections.delete(ws);
    } else {
      clients.delete(clientId);
    }
  });
});

// Automatically start the Node.js server using PM2
exec('pm2 start server.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erreur lors du démarrage du serveur: ${err}`);
    return;
  }
  console.log(`Sortie du serveur: ${stdout}`);
  console.error(`Erreur du serveur: ${stderr}`);
});
