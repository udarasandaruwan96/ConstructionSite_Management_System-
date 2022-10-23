const mongoose=require("mongoose")
const employeeSchema = new mongoose.Schema({
    employeeType:{
        type:String,
        required:true,
    },
    
    fullName:{
        type:String,
        required:true,
    },

    mobile:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    qualifications:{
        type:String,
        required:true,
    },
  
    profile_pic:{
        type:String,
        required:true,
    },

    project01_img:{
        type:String,
        required:true,
    },

    project01_disc:{
        type:String,
        required:true,
    },

    project02_img:{
        type:String,
        
    },

    project02_disc:{
        type:String,
    
    },

    project03_img:{
        type:String,
        
    },

    project03_disc:{
        type:String,
        
    },
});

module.exports=mongoose.model("Employee",employeeSchema);