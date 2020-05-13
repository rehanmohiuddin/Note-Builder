const express = require("express");
const router=express.Router();

const {isSignedIn,isAuthenticated,isAdmin}= require("../controllers/auth");
const {getProductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getallProducts,getAllUniqueCategories}=require("../controllers/product")
const {getUserById}=require("../controllers/user")

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById);

//all of actual routes
//write route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

//read routes
router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);
//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);
//listing route

router.get("/products",getallProducts);

router.get("/products/categories",getAllUniqueCategories);


module.exports =router;