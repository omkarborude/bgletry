const mongoose = require('mongoose');

const initializeConnectionToDb = async() =>{
    await mongoose.connect('mongodb+srv://osbwifi:omkar@8354@neog-cluster.b9ili.mongodb.net/test', {useNewUrlParser: true, useUnifiedTopology: true})
    console.log("db connected"); 
}

module.exports = initializeConnectionToDb;
