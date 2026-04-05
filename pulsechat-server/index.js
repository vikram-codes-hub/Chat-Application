require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder if you use multiple uploads
app.use('/uploads', express.static('uploads'));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'PulseChat API is running...' });
});

/* 
// Note: Uncomment these when your route files are implemented securely
// Example Route Imports
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const roomRoutes = require('./routes/room.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
*/

// Socket.io Events Setup
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Example socket setup
    // require('./sockets/index.socket')(io, socket);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('Warning: MONGO_URI is not set in .env');
        } else {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`Database is successfully connected`);
        }

        server.listen(PORT, () => {
            console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
