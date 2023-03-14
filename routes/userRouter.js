const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")

const fetch=require("../controllers/fetchUsers")

router.get("/fetchusers",userController.protect, fetch.getAllUsers)

module.exports=router