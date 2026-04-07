const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173" || "https://pulsechat-frontend-blush.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;