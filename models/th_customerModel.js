const mongoose=require("mongoose")
const customerSchema = new mongoose.Schema({
    
    fullName:{
        type:String,
        required:true,
    },

    nic:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    mobile:{
        type:String,
        required:true,
    },

    address:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },

    confirmPassword:{
        type:String,
        required:true,
    },
    
});

module.exports=mongoose.model("Customer",customerSchema);