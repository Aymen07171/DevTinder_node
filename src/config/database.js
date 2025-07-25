const mongoose = require('mongoose');
const env = require('dotenv');
env.config()

// Connect to MongoDB
const connectDB = async () => {
    const conn = await mongoose.connect('mongodb+srv://elattarayman1:ArVVlzRL3dJ11G8Q@devtinder.fr1hqkf.mongodb.net/devtinder?retryWrites=true&w=majority&appName=devtinder');
 
    try{

        if(conn) {
            
            console.log("Server is running on port ");
        }else {

            console.log("Server is not running")
        }

    }catch(err){

        console.log(err)

    }
}

module.exports = connectDB;
