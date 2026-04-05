const mongoose = require('mongoose');
require('dotenv').config();

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database is successfully connected`);
    } catch (error) {
        console.error('Error connecting to Database:', error);
        process.exit(1);
    }
}