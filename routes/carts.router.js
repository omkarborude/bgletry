const express = require("express");
const router = express.Router();
const {Cart} = require("../models/cart.model");
const {User} = require("../models/user.model");
const {extend} = require("lodash");

router.param("userid",async(req,res,next,id) => {
  try {
    const user = await User.findById({_id:id});

    if(!user) {
      res.status(404).json({success:false,message:"User Not Found, PLease check user id. "})
      return;
    }
    req.user = user;
    next();
  }catch(error) {
    res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})
router.param("userid",async(req,res,next,id)=> {
  try {
    let cart = await Cart.findOne({userId:id})

    if(!cart) {
      cart = new Cart({userId:id,products:[]});
      cart = await cart.save();
    }
    req.cart= cart;
    next();
  } catch(error) {
    res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})

router.route("/:userid/cart")
.get(async(req,res)=> {
  try {
    let {cart} = req;
    cart = await cart.populate({path:"products.productId",select: 'name price image offer inStock fastDelivery brand rating',}).execPopulate();

    userCartProducts = cart.products.filter((product)=>product.active);

    res.status(200).json({response:userCartProducts,success:true});
  }
  catch(error) {
    res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})
.post(async(req,res)=> {
  try {
    const updateProduct = req.body;
    const {cart} = req;

    const alreadyInCart = cart.products.find((product)=> product.productId == updateProduct._id);

    if(alreadyInCart){
      for (let product of cart.products) {
        if(updateProduct._id == product.productId){
          product = extend(product,updateProduct)
        }
      }
    } else {
      cart.products.push({productId:updateProduct._id,quantity: 1, active: true});
    }
    let databaseCart = await cart.save();
    databaseCart = await databaseCart.populate({path:"products.productId",select:'name price image offer inStock fastDelivery brand rating',}).execPopulate();

    userCartProducts = databaseCart.products.filter((product)=> product.active);

    res.status(200).json({response:userCartProducts,success:true})

  } catch(error) {
    res.json({success:false,message:"PLease check error message",errormessage:error.message})
  }
});

module.exports = router;