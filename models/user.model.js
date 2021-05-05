const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username:{
        type: String,
        unique: "Account already exists for this email",
        required:"Email id is required",
        
        },

    password: {
        type: String,
        required:"Password is required",
        validate: {
            validator: function(value) {
              return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g.test(value);
            },
            message: props => `Password should contain 8 letters(atleast one number, one smallcase and uppercase alphabets)`
          }
        },
        email:{
        type:String,
        required:"email is required !"
    },

    
},{
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = {User};