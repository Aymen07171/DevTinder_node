const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const app = express();
const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL
  credentials: true, // Permet l'envoi de cookies
  }))

// Middlewares - Ordre important
app.use(express.json());
app.use(cookieParser());



// Routes
// Authentication routes
const authRouter = require('./routes/auth'); // Importation des routes d'authentification
app.use('/', authRouter);


// Profile routes

const profileRouter = require('./routes/profile'); // Importation des routes de profil
app.use('/', profileRouter);


const requestRouter = require('./routes/request'); // Importation des routes de demande de connexion
app.use('/', requestRouter);  


const userRouter = require('./routes/user'); // Importation des routes utilisateur
app.use('/', userRouter);



const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    return app.listen(PORT, '0.0.0.0');
  })
  .then(() => {
    console.log(`Server is running on port ${PORT}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });''