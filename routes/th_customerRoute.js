const express = require("express");
const router = express.Router();
const Customer = require('../models/th_customerModel');
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

router.get("/add_Customer", (req, res) => {
    res.render("th_addCustomer", {
      title: "Add Customer Page",
    });
  });
  

//Add customer
router.post('/add_Customer', upload.any(),[

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
  
    
      Customer.find({}, (err, customers) => {
        if (err) {
          res.json({ message: err.message });
        } else {
          res.render("th_addCustomer.ejs", {
            title: "Add Customer",
            customers: customers,
            alert
          });
        }
      });
  
      
    } else {
      const customer = new Customer({
        fullName:req.body.fullName,
        nic:req.body.nic,
        email:req.body.email,
        mobile:req.body.mobile,
        address:req.body.address,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
      });
      customer.save((err) => {
        if (err) {
          res.json({ message: err.message, type: 'danger' });
        } else {
          req.session.message = {
            type: "success",
            message: "Customer Added Successfully",
          };
          res.redirect("/");
        }
      })
    }
  });

//Get all customers route
router.get("/get_Customer", (req, res) => {
  Customer.find({}, (err, customers) => {
    if (err) {
      res.json({message:err.message})
    } else {
      res.render("th_viewCustomers", { 
        title:'All Customers',
        customers: customers });
    }
  })

});

module.exports = router;