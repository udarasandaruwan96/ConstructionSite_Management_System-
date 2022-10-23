const express = require("express");
const router = express.Router();
const AdminGD = require('../models/shvAdminGDModel.js');
const multer = require('multer');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const path = require('path');
const Employee = require('../models/th_employeeModel');

// Image Uploading
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
  }),
  limits: {
    fileSize: 10000000 // max file size 10MB
  },
  fileFilter: function (req, file, cb) {

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
 checkFileType(file, cb);
  }
})

// Get All Garden Designers Route
router.get("/allAdminGD", (req, res) => {
  AdminGD.find().exec((err, adminGds) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvViewAllGardenDesigners", {
        title: "All Garden Designers",
        adminGds: adminGds,
      });
    }
  });
});


// Add Garden Designers Route
router.post('/addAdminGD', upload.any(), [

  check('Name')
    .matches(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)
    .withMessage('Invalid Name.. Please enter correct name !!'),

  check('Email')
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage('Email is not valid.. Please enter correct email !! !'),

  check('Phone')
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
        res.render("shvAddGardenDesigners.ejs", {
          title: "Add Garden Designers",
          employees: employees,
          alert
        });
      }
    });

    
  } else {
    const adminGd = new AdminGD({
      Name: req.body.Name,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Qualifications: req.body.Qualifications,
      ProfilePic: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
      FirstProjectPic: req.files[1] && req.files[1].filename ? req.files[1].filename : '',
      FirstProjectDesc: req.body.FirstProjectDesc,
      SecondProjectPic: req.files[2] && req.files[2].filename ? req.files[2].filename : '',
      SecondProjectDesc: req.body.SecondProjectDesc,
      ThirdProjectPic: req.files[3] && req.files[3].filename ? req.files[3].filename : '',
      ThirdProjectDesc: req.body.ThirdProjectDesc,
    });
    adminGd.save((err) => {
      if (err) {
        res.json({ message: err.message, type: 'danger' });
      } else {
        req.session.message = {
          type: "success",
          message: "Garden Designer Added Successfully",
        };
        res.redirect("/allAdminGD");
      }
    })
  }
});

router.get("/editAdminGD/:id", (req, res) => {
  let id = req.params.id;
  AdminGD.findById(id, (err, adminGd) => {
    if (err) {
      res.redirect("/");
    } else {
      if (adminGd == null) {
        res.redirect("/");
      } else {
        res.render("shvEditGardenDesigners", {
          title: "Edit Garden Designers",
          adminGd: adminGd,
        });
      }
    }
  });
});

// Update Garden Designer route
router.post("/updateAdminGD/:id", upload.any(), (req, res) => {
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

  AdminGD.findByIdAndUpdate(
    id,
    {
      Name: req.body.Name,
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
          message: "Garden Designer Updated Successfully",
        };
        res.redirect("/allAdminGD");
      }
    }
  );
});

// Delete User Route
router.get("/deleteAdminGD/:id", (req, res) => {
  let id = req.params.id;
  AdminGD.findByIdAndRemove(id, (err, result) => {
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
        message: "Garden Designer Deleted Successfully",
      };
      res.redirect("/allAdminGD");
    }
  });
});

// Get Specific Garden Designer Projects
router.get("/adminGDProj/:id", (req, res) => {
  let id = req.params.id;
  AdminGD.findById(id, (err, adminGds) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvSpecificGDProjects.ejs", {
        title: "Get Specific Projects",
        adminGds: adminGds,
      });
    }
  });
});


//search
router.get("/searchAdminGDs", (req, res) => {
  try {
    AdminGD.find(
      {
        $or: [
          { Name: { $regex: req.query.GDsearch } },
          { Phone: { $regex: req.query.GDsearch } },
        ],
      },
      (err, adminGds) => {
        if (err) {
          console.log(err);
        } else {
          res.render("shvViewAllGardenDesigners", {
            title: "All Garden Designers",
            adminGds: adminGds,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Main Home Page button click event
router.get("/", (req, res) => {
  res.render("MainHomePage", {
    title: "Main Home Page",
  });
});

// Admin Home Page button click event
router.get("/AdminHome", (req, res) => {
  res.render("AdminHomePage", {
    title: "Admin Home Page",
  });
});

// Client Home Page button click event
router.get("/ClientHome", (req, res) => {
  res.render("ClientHomePage", {
    title: "Client Home Page",
  });
});

module.exports = router;
