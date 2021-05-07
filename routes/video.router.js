const express = require('express');
const router = express.Router();
const Video  = require("../models/video.model")
const { extend } = require("lodash");

router.param("videoId",async (req, res, next, vId) => {

  try{
    const video = await Video.findById(vId);
    if(!video){
      throw Error("can't find video")
    }
    req.video = video;
    next();
  } catch(error) {
    res.status(400).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})

router.route("/")
.get(async(req,res)=> {
  try {
    const videos = await Video.find({});
    res.json({success:true,videos});
  } catch(error) {
    res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})
.post(async(req,res)=> {
  try{
    const video = req.body;
    const newVideo = new Video(video);
    const savedVideos = await newVideo.save();
    res.status(201).json({success:true,video:savedVideos})
  } catch(error) {
     res.status(500).json({success:false,message:"PLease check error message",errormessage:error.message})
  }
})

module.exports = router;