const mongoose=require("mongoose")
const architectRequirementSchema=new mongoose.Schema({
    Architecture:{
        type:String,
        required:true,
    },
    Client_Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Builging_Type:{
        type:String,
        required:true,
    },
  
    No_of_floors:{
        type:String,
        required:true,
    },
    Estimated_Budget:{
    type:String,
    required:true,
},
    Location:{
    type:String,
    
},

Plan_of_the_Land:{
    type:String,
    
    
},
Bed_Rooms:{
    type:String,

   
},

Bathrooms:{
    type:String,
   
    
},
Parking_Area:{
    type:String,
    
    
},
Other_Requirements:{
    type:String,
    
    
},
})

module.exports=mongoose.model("ArchitectRequirements",architectRequirementSchema)