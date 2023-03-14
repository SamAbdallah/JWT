const express=require("express")
const router=express.Router()
const ProductController=require("../controllers/productsController")

router.post("/addProduct",ProductController.createProduct)
router.get("/getProducts",ProductController.getAllProducts)
router.get("/filterItem",ProductController.filterItem)



module.exports=router