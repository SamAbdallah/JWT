const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose")

dotenv.config()

exports.connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("connected to database")
    }

    catch(err){
        console.log(err)
    }
}