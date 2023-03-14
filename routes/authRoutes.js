const express=require("express")
const router=express.Router()
const userController=require("../controllers/userController")

router.post("/signUp",userController.signUp)
router.get("/login",userController.login)
router.post("/forgotPassword",userController.forgotPassword)
router.post("/validateToken",userController.validateToken)
router.patch("/validateUser/:token",userController.validateUser)


router.patch("/resetPassword/:token",userController.resetPassword)


module.exports=router