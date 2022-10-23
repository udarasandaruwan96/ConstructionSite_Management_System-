let express = require('express');
let multer = require('multer')
const router=express.Router();
let Archi_Requirements= require('../models/sugClientADModel');
const { check, validationResult } = require('express-validator');
let Architect= require('../models/sugAdminADModel');


let path = require('path');
let fs = require('fs');
let dir = './uploads';


let upload = multer({
  storage: multer.diskStorage({

    destination: (req, file, callback) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),
  limits: {
    fileSize: 10000000 // max file size 20MB 
  },

  fileFilter: (req, file, cb) => {
   checkFileType(file, cb)
  }
});
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error.. Images Only with PNG and JPEG !");
  }
}












router.post('/client_project_architects/:id', upload.any(),[

  check('Client_Name')
    .matches(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)
    .withMessage('Invalid Name.. Please enter correct name !!'),

  check('Email')
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage('Email is not valid.. Please enter correct email !! !'),

 

], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
    let id=req.params.id;
    Architect.findById(id,(err,data)=>{
      if(err){
        res.json({ message: err.message });
      }else{
          res.render("sug_add_requirement.ejs",{
              
              data:data, 
              alert 
          })
      }
  })


    
      
      
    
  

  }
  else {
 
      let requirement= new Archi_Requirements({

      
        Architecture:req.body.Architecture,
        Client_Name:req.body.Client_Name,
        Email:req.body.Email,
        Builging_Type:req.body.Builging_Type,
        No_of_floors:req.body.No_of_floors,
        Estimated_Budget:req.body.Estimated_Budget,
        Location:req.body.Location,
        Plan_of_the_Land:req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        Bed_Rooms:req.body.Bed_Rooms,
        Bathrooms:req.body.Bathrooms,
        Parking_Area:req.body.Parking_Area,
        Other_Requirements:req.body.Other_Requirements

        
      
      });

      requirement.save((err) => {
        if (err){
        res.json({message:err.message,type:'danger'});
        }
        else{
          req.session.message={
            type:'success',
            message:'requirments  added succssfully'
        };
        res.redirect('/Specific_Archi_requirements');
        }
          

      });

  

  }

});

//get specific architect requirements
router.get("/Specific_Archi_requirements",(req,res) =>{
  Archi_Requirements.find().sort({$natural: -1 }).limit(1).exec((err,data)=>{
      if(err){
        res.json({message:err.message})
          
      }else{
        res.render('sug_client_view_requierments.ejs', { 
          title:'client_view_Architect_requierments',
          data: data });
      }
     

      
  });  

});







//Edit an user route
router.get("/edit_architect_requirements/:id",(req,res)=>{
  let id=req.params.id;
  Archi_Requirements.findById(id,(err,data)=>{
      if(err){
          res.redirect("/Specific_Archi_requirements")
      }else{
          res.render("sug_edit_client_archi_requirements.ejs",{
              title:'Edit architect Requirements',
              data:data, 
          })
      }
  })
})


//update user route

router.post('/update_architect_requirements/:id',upload.any(),(req,res)=>{
  let id=req.params.id;

 

  let new_Plan_of_the_Land="";
 


  if(req.files[0]){
      new_Plan_of_the_Land=req.files[0] && req.files[0].filename ? req.files[0].filename : ''
      try{
          fs.unlinkSync('./uploads/'+req.body.old_Plan_of_the_Land);
          }catch(err){
          console.log(err)
        }
   }else{
      new_Plan_of_the_Land=req.body.old_Plan_of_the_Land;
  }
      
  Archi_Requirements.findByIdAndUpdate(id,{
     
     

    Architecture:req.body.Architecture,
    Client_Name:req.body.Client_Name,
    Email:req.body.Email,
    Builging_Type:req.body.Builging_Type,
    No_of_floors:req.body.No_of_floors,
    Estimated_Budget:req.body.Estimated_Budget,
    Location:req.body.Location,
    Plan_of_the_Land:new_Plan_of_the_Land,
    Bed_Rooms:req.body.Bed_Rooms,
    Bathrooms:req.body.Bathrooms,
    Parking_Area:req.body.Parking_Area,
    Other_Requirements:req.body.Other_Requirements


  },(err,result)=>{
      if(err){
          res.json({message:err.message, type:"danger"});
      }else{
          req.session.message={
              type:'success',
              message:"requirements updateed successfully"
          }

          res.redirect("/Specific_Archi_requirements")
      }
  })
});





//delete archiect_requirements
router.get('/delete_architect_requirements/:id',(req,res)=>{
  let id=req.params.id;
  Archi_Requirements.findByIdAndRemove(id,(err,result)=>{
     if(result.Plan_of_the_Land!=''){
      try{
          fs.unlinkSync('./uploads/'+result.Plan_of_the_Land);
         
      }catch(err){
          console.log(err);
      }
     }
     if (err){
      res.json({message:err.message});
     }else{
      req.session.message={
          type:'success',
          message:'Architect Requirements deleted successfully'
      };

      res.redirect("/client_all_architects");
     }
  })
})


// all clients archi requirements
router.get("/all_architect_requirements", (req, res) => {
  Archi_Requirements.find({}, (err, data) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render('sug_all_architect_requirements.ejs', { 
        title:'all_architect_requirements',
        data: data });
    }
  })

});


//search
router.get('/searchArchi_requirements',(req,res)=>{
  try {
    Archi_Requirements.find({$or:[{architect:{'$regex':req.query.Archisearch}},{mobile:{'$regex':req.query.Archisearch}}]},(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                  res.render('sug_all_architect_requirements.ejs', {
                      title: 'all_architect_requirements',
                      data: data
                  })
               }
           })
  } catch (error) {
      console.log(error);
  }
});

module.exports=router;
