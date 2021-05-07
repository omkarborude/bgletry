const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
  vid:{
    type:String,
    required:"ID require for each item !",
    unique:true,
     },
  title:{
    type:String,
    required:"Title name is require for each item !"
       },
  image:String,
  author:String,
  subscribers:Number,
  views:Number,
  date:Date,
},
{
  timestamps:true,
}
);

const Video = mongoose.model("Video",videoSchema);

module.exports = Video;