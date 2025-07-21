const mongoose = require('mongoose');
const env = require('dotenv');
env.config()

// Connect to MongoDB
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DATABASE);
 
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
