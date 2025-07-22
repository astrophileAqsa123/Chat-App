import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
    
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        require:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:" "
 
    },
      about: {
      type: String,
      default: "", // Default to empty string
      maxlength: 500, // Optional: limit the length
    },
    contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
},
{timestamps:true}
);
const User=mongoose.model("User",userSchema);
export default User;