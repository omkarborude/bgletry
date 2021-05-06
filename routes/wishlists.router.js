const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const { User } = require("../models/user.model");

router.param("userid", async(req, res, next, id)=>{
    try{
        const user = await User.findById({_id: id});
        
        if(!user){
            res.status(404).json({success:false, message: "User Not Found, PLease check user id.",errormessage:error.message});
            return;
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(500).json({success:false, message: "PLease check error message", errorMessage: error.message })
    }
})
router.param("userid", async(req,res,next,id)=>{
    try {
        let wishlist = await Wishlist.findOne({userId: id});
        
        if(!wishlist){
            wishlist = new Wishlist({userId:id, products: []});
            wishlist = await wishlist.save();
        }
        req.wishlist = wishlist;
        next();
    } catch(error) {
        res.status(500).json({success:false, message: "PLease check error message", errorMessage: error.message })
    }
})

router.route("/:userid/wishlist")
.get( async(req,res)=>{
    try { 
        let {wishlist} = req ;
        wishlist = await wishlist.populate({path:"products.productId", select: 'name price image offer inStock fastDelivery brand rating',}).execPopulate();
        
        userWishlistProducts = wishlist.products.filter((product)=>product.active);
        res.status(200).json({ response : userWishlistProducts, success : true });

    } catch(error) {
    res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})
.post( async(req,res)=>{
    try {       
        const updateProduct = req.body;
        const {wishlist} = req ;
        
        const alreadyInWishlist = wishlist.products.find((product)=>product.productId == updateProduct._id);
        
       
        if(alreadyInWishlist) {
           for( let product of wishlist.products) {
                if(updateProduct._id == product.productId){
                    product.active = !product.active;
                }
           }
        } else {
            wishlist.products.push({productId: updateProduct._id, active: true});
        } 
        let databaseWishlist = await wishlist.save();
        databaseWishlist = await databaseWishlist.populate({path:"products.productId", select: 'name price image offer inStock fastDelivery brand rating',}).execPopulate();
        
        userWishlistProducts = databaseWishlist.products.filter((product)=>product.active);
        
        res.status(200).json({ response : userWishlistProducts, success : true })

    }  catch(error){
       res.json({success:false,message:"PLease check error message",errormessage:error.message})
    }
    
})
module.exports = router;