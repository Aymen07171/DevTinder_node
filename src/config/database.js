const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://elattarayman1:ArVVlzRL3dJ11G8Q@devtinder.fr1hqkf.mongodb.net/devtinder?retryWrites=true&w=majority&appName=devtinder');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with failure
    }
}

module.exports = connectDB;
