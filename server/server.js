// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');

// ---- Database Connection ----
const MONGODB_URI = "mongodb://localhost:27017/document-db";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to local MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));
// ---------------------------

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// This object will store the content of each document in memory (we will replace this next)
const documents = {};

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // A user now needs to "join" a specific document room.
    socket.on('join-document', (documentId) => {
        // Find the document's current content or create a new empty one.
        const content = documents[documentId] || ""; 
        
        // Put this user's socket into the specified room.
        socket.join(documentId);
        
        // Send the document's current content to this user.
        socket.emit('load-document', content);

        // Listen for changes for this specific document.
        socket.on('send-changes', (delta) => {
            // Store the updated content.
            documents[documentId] = delta;
            // Broadcast the changes only to users in the same room.
            socket.to(documentId).emit('receive-changes', delta);
        });
    });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Backend server listening on port ${PORT}`));