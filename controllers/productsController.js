const User=require("../models/userModel")
const Product=require("../models/productModel")

exports.createProduct=async(req,res)=>{
    try{
    currentUser=await User.findById(req.body.currentUserId)
    if(!currentUser){
        return res.status(401).json({message:"user does not exist"})
    }

    if(currentUser.type!=="admin"){
        return res.status(401).json({message:"you are not an admin"})
    }

    const newProduct=await Product.create({
        userID:req.body.currentUserId,
        productName:req.body.productName,
        category:req.body.category,


    })
    return res.status(201).json({message:"Product created",data:newProduct})
    }
    catch(err){
        console.log(err)
    }
}

exports.getAllProducts=async(req,res)=>{
    try{
    allProducts=await Product.find()  
    return res.status(201).json({message:"Product found",data:allProducts})

    }
    catch(err){
        console.log(err)
    }

}

exports.filterItem=async(req,res)=>{
    try{
        items=await Product.find({category:req.body.category})
        return res.status(201).json({message:"items belonging to specified type are:",data:items})
    }
    catch(err){
        console.log(err)
    }
}