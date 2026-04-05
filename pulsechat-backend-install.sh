#!/bin/bash

echo "Installing PulseChat Backend dependencies..."

cd pulsechat-server

npm init -y

# Core dependencies
npm install express mongoose socket.io cors dotenv bcryptjs jsonwebtoken

# File upload & cloud
npm install multer cloudinary

# Utilities
npm install cookie-parser express-async-handler

# Dev dependencies
npm install --save-dev nodemon

echo ""
echo "✅ Backend dependencies installed!"
echo ""
echo "📦 Installed packages:"
echo "   express             - Web framework"
echo "   mongoose            - MongoDB ODM"
echo "   socket.io           - Real-time engine"
echo "   cors                - Cross-origin requests"
echo "   dotenv              - Environment variables"
echo "   bcryptjs            - Password hashing"
echo "   jsonwebtoken        - JWT auth"
echo "   multer              - File upload middleware"
echo "   cloudinary          - Cloud image storage"
echo "   cookie-parser       - Cookie parsing"
echo "   express-async-handler - Async error handling"
echo "   nodemon             - Dev auto-restart [DEV]"