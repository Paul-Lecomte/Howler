const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
    }
});

// Use CORS middleware
app.use(cors());

let connectedUsers = {}; // Store connected users

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send the current user list to the newly connected user
    socket.emit('users', Object.values(connectedUsers));

    // Listen for the user's name when they join
    socket.on('setUsername', (username) => {
        connectedUsers[socket.id] = username;
        console.log(`${username} connected`);

        // Notify all clients about the new user (exclude the current user)
        const userList = Object.values(connectedUsers).filter(user => user !== username);
        io.emit('users', userList); // Emit user list excluding the current user
    });

    // Handle message events
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        socket.broadcast.emit('message', msg); // Broadcast message to other users
    });

    // User disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const username = connectedUsers[socket.id];
        delete connectedUsers[socket.id];

        // Notify all clients about the user leaving
        const userList = Object.values(connectedUsers).filter(user => user !== username);
        io.emit('users', userList); // Emit user list excluding the disconnected user
    });
});

// Optional: graceful shutdown (ensure server cleans up resources when stopped)
server.on('close', () => {
    console.log('Server is shutting down');
    io.close();
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});