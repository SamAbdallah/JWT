const User=require("../models/userModel")
const validator=require("validator")
const bcrypt=require("bcrypt")
const sendMail=require("../utils/emai").sendMail
const crypto=require("crypto")
const jwt=require("jsonwebtoken")
const {promisify}=require("util")

//to create token we should split the process into 2 parts
//create a function that will sign a token
//to sign a token:
 //factor1:a unique field from the user,id
 //factor2:JWT_Secret
 //Factor3:JWT_Expires_In

const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
} 

//create a function that sends the token 

const createSendToken=(user,statusCode,res,msg)=>{
    const token=signToken(user._id)
    res.status(statusCode).json({
        status:"success",
        msg,
        token,
        data:{
            user
        }
    })
}

exports.signUp=async(req,res)=>{

    try{
        let email=req.body.email;
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid Email"})
        }

        const checkEmail=await User.findOne({email:req.body.email})
        if (checkEmail){
            return res.status(409).json({message:"email is already in use"})
        }

        let pass=req.body.password
        let passConfirm=req.body.passwordConfirm 
        if (pass!==passConfirm){
            return res.status(400).json({message:"passwords do not match"})
        }



        const newUser=await User.create({
            fullName:req.body.fullName,
            email:req.body.email,
            password:req.body.password,
            type:req.body.type
        })

        createSendToken(newUser,201,res,"user Created successfully!")

        this.validateToken(req,res,email)

   
    
        
        //email valid
        //email in use find one and return first match
        //pass and pass confirm match

    }

    catch(err){
        res.status(400).json({message:err.message})
    }
}

exports.login=async(req,res)=>{
    try{
        //check if user exists
        //check if password matches hashed password
        let user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({message:"the user does not exist"})

        }
        if(!await user.checkPassword(req.body.password,user.password)){
            return res.status(401).json({message:"passwords problem"})
        }
        createSendToken(user,201,res,"user logged in successfully!")
    }
    catch(err){
        console.log(err)
    }
}

exports.forgotPassword=async(req,res)=>{
    try{        //check if user exists 


        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({message:"user with this email does not exist"})
        }
        //create the reset token

        const resetToken=user.generatePasswordResetToken()
        await user.save({validateBeforeSave:false})

        //send the token via email
        //link/reset token
        //create url
        const url=`${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`
        const msg=`Forgot password?reset bs visiting this link ${url}`
        try{
            await sendMail({
                receiver:user.email,
                subject:"your token valid for 10 minutes",
                content:msg,
            })
            res.status(200).json({status:"success",message:"reset link sent"})


        }
        catch(err){
user.passwordResetToken=undefined
user.passwordResetExpires=undefined
await user.save({validateBeforeSave:false})
res.status(500).json({message:"error occured while sending"})
console.log(err)

        }

    }
    catch(err){
        console.log(err)

    }
}

exports.resetPassword=async(req,res)=>{
    try{
        const hashedToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
        if(!user){
            return res.status(400).json({message:"token invalid or expired request a new one"})
        }
        if(req.body.password.length<8){
            return res.status(400).json({message:"password length too short"})

        }
        if(req.body.password!==req.body.passwordConfirm){
            return res.status(400).json({message:"password and pass confirm not the same"})

        }
        user.password=req.body.password
        user.passwordConfirm=req.body.passwordConfirm
        user.passwordResetToken=undefined
        user.passwordResetExpires=undefined
        user.passwordChangedAt=Date.now()
        await user.save()
        return res.status(200).json({message:"password changed successfully"})

    }
    catch(err){
        console.log(err)
    }
}



exports.validateToken=async(req,res,email)=>{
    let user=await User.findOne({email:email})

    try{   
        const validity=user.generateValidity()
        console.log(validity)
        await user.save({validateBeforeSave:false})

 
        const url=`${req.protocol}://${req.get("host")}/validateUser/${validity}`
        const msg=`validate your account uisng this link ${url}`
        try{
            await sendMail({
                receiver:req.body.email,
                subject:"your token valid for 10 minutes",
                content:msg,
            })
            // res.status(200).json({status:"success",message:"validation link sent sent"})


        }
        catch(err){
user.validationToken=undefined
user.validationExpires=undefined
await user.save({validateBeforeSave:false})
res.status(500).json({message:"error occured while sending"})
console.log(err)

        }

    }
    catch(err){
        console.log(err)

    }
}




exports.validateUser=async(req,res)=>{
    try{
        const hashedToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user=await User.findOne({validationToken:hashedToken,validationExpires:{$gt:Date.now()}})
        if(!user){
            return res.status(400).json({message:"token invalid or expired request a new one"})
        }

   
        
        user.isVerified=true
        user.validationToken=undefined
        user.validationExpires=undefined
        user.validatedAt =Date.now()
        await user.save()
        return res.status(200).json({message:"micheal jordon activated"})

    }
    catch(err){
        console.log(err)
    }
}

exports.protect=async(req,res,next)=>{
    try{
        //1_check if token owner exists
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }

        if(!token){
            return res.status(401).json({message:"You are not logged in,please login to access"})

        }
        //2_verify the token
        let decoded;
        try{
            decoded=await promisify (jwt.verify)(token,process.env.JWT_SECRET)


        }
        catch(error){
            if(error.name==="JsonWebTokenError"){
                return res.status(401).json({message:"Invalid token,login again"})
            }

            else if(error.name==="TokenExpiredError"){
                return res.status(401).json({message:"yoúr session token has expired"})

            }

        }
        //3_check if the token owner exist
        const currentUser=await User.findById(decoded.id)
        if(!currentUser){
            return res.status(401).json({message:"the user belonging to this session does not longer exists"})

        }
        //4_check if the owner changed the password after the token was created
        //iat:time token issued
        //exp:time where the token expired
        if(currentUser.passwordChangedAfterTokenIssued(decoded.iat)){
            return res.status(401).json({message:"your password changed,log in again"})

        }
        //5_if all of the above are valid add the user to all the requests{req.user=currentUser}
        req.user=currentUser;
        next();
    }
    catch(err){
        console.log(err)
    }
}