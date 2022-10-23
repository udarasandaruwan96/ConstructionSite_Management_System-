let express = require('express');
let multer = require('multer')
const router=express.Router();
let Architect= require('../models/sugAdminADModel');
const { check, validationResult } = require('express-validator');
const Employee = require('../models/th_employeeModel');


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









 router.get("/All_Architect", (req, res) => {
    Architect.find({}, (err, data) => {
      if (err) {
        res.json({message:err.message})
      } else {
        res.render('sug_all_architect.ejs', { 
          title:'All architects',
          data: data });
      }
    })
  
  });


router.post('/add_Architect', upload.any(),[

  check('architect')
    .matches(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)
    .withMessage('Invalid Name.. Please enter correct name !!'),

  check('email')
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage('Email is not valid.. Please enter correct email !! !'),

  check('mobile')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number is not valid.. Please enter correct mobile number !! !'),

], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
  

    Employee.find({}, (err, employees) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("sug_add_architecture.ejs", {
          title: "add architecture",
          employees: employees,
          alert
        });
      }
    });
  

  

  }
  else {
 
      let architect = new Architect({

      
        architect:req.body.architect,
        mobile:req.body.mobile,
        email:req.body.email,
        qualifications:req.body.qualifications,
        profile_pic:req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        project01_img:req.files[1] && req.files[1].filename ? req.files[1].filename : '',
        project01_disc:req.body.project01_disc,
        project02_img:req.files[2] && req.files[2].filename ? req.files[2].filename : '',
        project02_disc:req.body.project02_disc,
        project03_img:req.files[3] && req.files[3].filename ? req.files[3].filename : '',
        project03_disc:req.body.project03_disc
        
      
      });

      architect.save((err) => {
        if (err){
        res.json({message:err.message,type:'danger'});
        }
        else{
          req.session.message={
            type:'success',
            message:'Architect  added succssfully'
        };
        res.redirect('/All_Architect');
        }
          

      });

  

  }

});


//Edit an user route
router.get("/edit_architect/:id",(req,res)=>{
  let id=req.params.id;
  Architect.findById(id,(err,data)=>{
      if(err){
          res.redirect("/All_Architect")
      }else{
          res.render("sug_edit_architect.ejs",{
              title:'Edit architects',
              data:data, 
          })
      }
  })
})


//update user route

router.post('/update_architect/:id',upload.any(),(req,res)=>{
  let id=req.params.id;

 

  let new_profile_pic="";
  let new_project01_img="";
  let new_project02_img="";
  let new_project03_img="";

 



  if(req.files[0]){
      new_profile_pic=req.files[0] && req.files[0].filename ? req.files[0].filename : ''
      try{
          fs.unlinkSync('./uploads/'+req.body.old_profile_pic);
          }catch(err){
          console.log(err)
        }
   }else{
      new_profile_pic=req.body.old_profile_pic;
  }



  if(req.files[1]){
    new_project01_img=req.files[1] && req.files[1].filename ? req.files[1].filename : ''
    try{
       fs.unlinkSync('./uploads/'+req.body.old_project01_img);
    }catch(err){
        console.log(err)
    }
    }else{ 
        new_project01_img=req.body.old_project01_img;
    }
     
    if(req.files[2]){
      new_project02_img=req.files[2] && req.files[2].filename ? req.files[2].filename : ''
      try{
         fs.unlinkSync('./uploads/'+req.body.old_project02_img);
      }catch(err){
          console.log(err)
      }
      }else{ 
          new_project02_img=req.body.old_project02_img;
      }
    

      if(req.files[3]){
        new_project03_img=req.files[3] && req.files[3].filename ? req.files[3].filename : ''
        try{
           fs.unlinkSync('./uploads/'+req.body.old_project03_img);
        }catch(err){
            console.log(err)
        }
        }else{ 
            new_project03_img=req.body.old_project03_img;
        }





      
  Architect.findByIdAndUpdate(id,{
     
     

      architect:req.body.architect,
      mobile:req.body.mobile,
      email:req.body.email,
      qualifications:req.body.qualifications,

      profile_pic:new_profile_pic,

      project01_img:new_project01_img,
      project01_disc:req.body.project01_disc,

      project02_img: new_project02_img,
      project02_disc:req.body.project02_disc,

      project03_img: new_project03_img,
      project03_disc:req.body.project03_disc

  },(err,result)=>{
      if(err){
          res.json({message:err.message, type:"danger"});
      }else{
          req.session.message={
              type:'success',
              message:"User updateed successfully"
          }

          res.redirect("/All_Architect")
      }
  })
});






router.get('/delete_architect/:id',(req,res)=>{
  let id=req.params.id;
  Architect.findByIdAndRemove(id,(err,result)=>{
     if(result.profile_pic!=''||result.result.project01_img!=''||result.result.project02_img!=''||result.result.project03_img!=''){
      try{
          fs.unlinkSync('./uploads/'+result.profile_pic);
          fs.unlinkSync('./uploads/'+result.project01_img);
          fs.unlinkSync('./uploads/'+result.project02_img);
          fs.unlinkSync('./uploads/'+result.project03_img);
      }catch(err){
          console.log(err);
      }
     }
  

     if (err){
      res.json({message:err.message});
     }else{
      req.session.message={
          type:'success',
          message:'Architect deleted successfully'
      };

      res.redirect("/All_Architect");
     }
  })
})



router.get("/project_architect/:id",(req,res)=>{
  let id=req.params.id;
  Architect.findById(id,(err,data)=>{
      if(err){
          res.redirect("/All_Architect")
      }else{
          res.render("sug_architects_project.ejs",{
              
              data:data, 
          })
      }
  })
})


//search
router.get('/searchAdminArchitects',(req,res)=>{
  try {
    Architect.find({$or:[{architect:{'$regex':req.query.Archisearch}},{mobile:{'$regex':req.query.Archisearch}}]},(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                  res.render('sug_all_architect.ejs', {
                      title: 'All architects',
                      data: data
                  })
               }
           })
  } catch (error) {
      console.log(error);
  }
});


router.get("/client_Home_Page",(req,res)=>{
  
          res.render("ClientHomePage.ejs",{
              title:'client_Home_Page',
             
          })
      

})




router.get("/client_all_architects", (req, res) => {
  Architect.find({}, (err, data) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render('sug_client_all_architects.ejs', { 
        title:'client_all_architects',
        data: data });
    }
  })

});

router.get("/client_project_architects/:id",(req,res)=>{
  let id=req.params.id;
  Architect.findById(id,(err,data)=>{
      if(err){
          res.redirect("client_all_architects.ejs")
      }else{
          res.render("sug_add_requirement.ejs",{
            
              data:data, 
          })
      }
  })
})

//search clients
router.get('/searchClientsArchitects',(req,res)=>{
  try {
    Architect.find({$or:[{architect:{'$regex':req.query.Archisearch}},{mobile:{'$regex':req.query.Archisearch}}]},(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                  res.render('sug_client_all_architects.ejs', {
                      title: 'All architects',
                      data: data
                  })
               }
           })
  } catch (error) {
      console.log(error);
  }
});






module.exports=router;

