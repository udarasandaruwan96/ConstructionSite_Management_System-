const express = require("express");
const router = express.Router();
const Employee = require('../models/th_employeeModel');
const path= require('path');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const dir = './uploads';

// Image Uploading
const upload = multer({
  storage: multer.diskStorage({

    destination: (req, file, callback) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});


// Add Employee Route
    router.post('/add_Employee', upload.any(), [

      check('fullName')
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
            res.render("th_addEmployee.ejs", {
              title: "Add Employees",
              employees: employees,
              alert
            });
          }
        });
    
        
      } else {
        const employee = new Employee({
          employeeType:req.body.employeeType,
          fullName:req.body.fullName,
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
        employee.save((err) => {
          if (err) {
            res.json({ message: err.message, type: 'danger' });
          } else {
            req.session.message = {
              type: "success",
              message: "Employee Added Successfully",
            };
            res.redirect("/get_Employee");
          }
        })
      }
    });

router.get("/employee_Management", (req, res) => {
  res.render("th_Home", {
      title: "Home Page",
  });
});


router.get("/add_Employee", (req, res) => {
  res.render("th_addEmployee", {
    title: "Add Employee Page",
  });
});

//Get all employee route
router.get("/get_Employee", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("th_viewEmployee", { 
        title:'All Employee',
        employees: employees });
    }
  })

});

//Edit employee details route
router.get('/edit_Employee/:id', (req,res) => {
  let id = req.params.id;
  Employee.findById(id, (err, employees) => {
    if (err) {
      res.redirect("/");
    } else {
      if (employees == null) {
        res.redirect("/");
      } else {
        res.render("th_updateEmployee", {
          title: "Edit Employee",
          employees: employees,
        });
      }
    }
  });
});

// Update employee route
router.post("/update_Employee/:id", upload.any(), (req, res) => {
  let id = req.params.id;
  let new_ProfilePic = "";
  let new_FirstProjectPic = "";
  let new_SecondProjectPic = "";
  let new_ThirdProjectPic = "";

  // Profile Pic
  if (req.files[0]) {
    new_ProfilePic =
      req.files[0] && req.files[0].filename ? req.files[0].filename : "";
    try {
      fs.unlinkSync(`./uploads/${req.body.old_ProfilePic}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_ProfilePic = req.body.old_ProfilePic;
  }

  // First Project Pic
  if (req.files[1]) {
    new_FirstProjectPic =
      req.files[1] && req.files[1].filename ? req.files[1].filename : "";
    try {
      fs.unlinkSync(`./uploads/${req.body.old_FirstProjectPic}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_FirstProjectPic = req.body.old_FirstProjectPic;
  }

  // Second Project Pic
  if (req.files[2]) {
    new_SecondProjectPic =
      req.files[2] && req.files[2].filename ? req.files[2].filename : "";

    try {
      fs.unlinkSync(`./uploads/${req.body.old_SecondProjectPic}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_SecondProjectPic = req.body.old_SecondProjectPic;
  }

  // Third Project Pic
  if (req.files[3]) {
    new_ThirdProjectPic =
      req.files[3] && req.files[3].filename ? req.files[3].filename : "";

    try {
      fs.unlinkSync(`./uploads/${req.body.old_ThirdProjectPic}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_ThirdProjectPic = req.body.old_ThirdProjectPic;
  }

  Employee.findByIdAndUpdate(
    id,
    {
      employeeType:req.body.employeeType,
      fullName:req.body.fullName,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Qualifications: req.body.Qualifications,
      ProfilePic: new_ProfilePic,
      FirstProjectPic: new_FirstProjectPic,
      FirstProjectDesc: req.body.FirstProjectDesc,
      SecondProjectPic: new_SecondProjectPic,
      SecondProjectDesc: req.body.SecondProjectDesc,
      ThirdProjectPic: new_ThirdProjectPic,
      ThirdProjectDesc: req.body.ThirdProjectDesc,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Employee Details Updated Successfully",
        };
        res.redirect("/get_Employee");
      }
    }
  );
});

// Delete Employee Route
router.get("/delete_Employee/:id", (req, res) => {
  let id = req.params.id;
  Employee.findByIdAndRemove(id, (err, result) => {
    if (
      result.ProfilePic != "" ||
      result.FirstProjectPic != "" ||
      result.SecondProjectPic != "" ||
      result.ThirdProjectPic != ""
    ) {
      try {
        fs.unlinkSync(`./uploads/${result.ProfilePic}`);
        fs.unlinkSync(`./uploads/${result.FirstProjectPic}`);
        fs.unlinkSync(`./uploads/${result.SecondProjectPic}`);
        fs.unlinkSync(`./uploads/${result.ThirdProjectPic}`);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "Employee Deleted Successfully",
      };
      res.redirect("/get_Employee");
    }
  });
});




//Get all employee to architectues page
router.get("/add_Architect", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("sug_add_architecture.ejs", { 
        
        employees: employees });
    }
  })

});

//Get all employee route Interior designers page
router.get("/addIntiriorDesigner", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("ud_Add_Intirior_Designer.ejs", { 
        
        employees: employees });
    }
  })

});



//Get all employee route garden designer page
router.get("/addAdminGD", (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("shvAddGardenDesigners.ejs", { 
       
        employees: employees });
    }
  })

});





module.exports = router;
