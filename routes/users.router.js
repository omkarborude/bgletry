const express = require("express");
const router = express.Router();
const {User} = require("../models/user.model");
const {extend} = require("lodash");
const e = require("express");

router.route("/signup")
.post( async (req,res)=>{
    try {
        const userData = req.body;
        
        const user = await User.findOne({username: userData.username});

        if(user){
            res.status(409).json({success: false, message: "Account already exists for this email, please reset password if forgotten"});
            return;
        }

        const NewUser = new User(userData);
        const addedUserDataFromDb = await NewUser.save();

        res.status(201).json({response: {
           username: addedUserDataFromDb.username,
           useremail:addedUserDataFromDb.email,
           userId: addedUserDataFromDb._id}, 
           success: true ,
           message:" registerd successed ! "})

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.route("/login")
.post( async(req,res)=>{
    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({email});
        
        if(!user){
            res.status(401).json({success:false, message: "Username is incorrect!"});
            return;
        }else if(user.password === password){
            res.status(200).json(
              {response: 
              {email: user.email,
              username:user.username,
              userId: user._id}, success: true});
            return;
        }
        res.status(401).json({ message : "Password is incorrect!", success : false });
        
    }  catch(error){
        
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})

router.param("username", async(req, res, next, id)=>{
    const user = await User.findOne({username: id});
        
        if(!user){
            res.status(404).json({success:false, message: "Username does not exist!"});
            return;
        }
        req.user = user;
        next();
})

router.route("/:username")
.get( async(req,res)=>{
    try {
        const { user } = req;
        res.status(200).json({ response :  {username: user.username, firstname: user.firstname, lastname: user.lastname, userId: user._id}, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }
})
.post( async(req,res)=>{
    try {
        let { user } = req;
        
        const userUpdates = req.body

        user = extend(user, userUpdates)
        
        user = await user.save();
        res.status(200).json({ response:{username: user.username, firstname: user.firstname, lastname: user.lastname, userId: user._id}, success : true })

    }  catch(error){
        res.status(500).json({success:false, message: "Request failed please check errorMessage key for more details", errorMessage: error.message })
    }  
})


module.exports = router;