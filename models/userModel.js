const mongoose=require("mongoose")
const bcyrpt=require("bcrypt")
const crypto=require("crypto")
const userSchema=new mongoose.Schema({

fullName:{
    type:String,
    required:[true,"please enter full name"],
    trim:true
},

email:{
    type:String,
    required:[true,"please enter email"],
    trim:true,
    unique:true,
    lowercase:true
},

password:{
    type:String,
    trim:true,
    minLength:8,
},

passwordConfirm:{
    type:String,
    trim:true,
    minLength:8,
},

type:{
    type:String,
    required:true
},
isVerified:{
    type:Boolean,
    default:false
},
passwordChangedAt:Date,
passwordResetToken:String,
passwordResetExpires:Date,

validatedAt:Date,
validationToken:String,
validationExpires:Date,

},
{timestamps:true}
)

userSchema.pre("save",async function(next){
    try{
        if(!this.isModified("password")){
            return next()
        }
        this.password= await bcyrpt.hash(this.password,12)
        this.passwordConfirm=undefined

    }
    catch(err){
        console.log(err)
    }
})

userSchema.methods.checkPassword=async function(candidatePassword,UserPassword){
    return bcyrpt.compare(candidatePassword,UserPassword)

}

//function to create random reset Token

userSchema.methods.generatePasswordResetToken=function () {
    const resetToken=crypto.randomBytes(32).toString("hex") //will be sent via email
    //saved in database in a hashed way
    this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpires=Date.now()+10*60*1000 //10 min of validity
    return resetToken
}


userSchema.methods.generateValidity=function () {
    const validityToken=crypto.randomBytes(32).toString("hex") //will be sent via email
    //saved in database in a hashed way
    this.validationToken=crypto.createHash("sha256").update(validityToken).digest("hex")
    this.validationExpires=Date.now()+10*60*1000 //10 min of validity
    return validityToken
}

//this function will check if the password is changed after the jwt token

userSchema.methods.passwordChangedAfterTokenIssued=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passwordChangedTime=parseInt(this.passwordChangedAt.getTime()/1000,10)
        return passwordChangedTime > JWTTimestamp 
    }

    return false
}



module.exports=mongoose.model("User",userSchema)