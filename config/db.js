const mongoose = require("mongoose");

const connectDB = async()=>{
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL);
       console.log("sucessfully connected")
    } catch(error){
        console.log(`Error in Database${error}`)
    }
}

module.exports = connectDB;