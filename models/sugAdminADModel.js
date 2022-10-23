const mongoose=require("mongoose")
const architectSchema=new mongoose.Schema({
    architect:{
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
})

module.exports=mongoose.model("Architect",architectSchema)