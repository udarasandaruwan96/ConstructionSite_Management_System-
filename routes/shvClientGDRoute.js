const express = require("express");
const router = express.Router();
const AdminGD = require('../models/shvAdminGDModel.js');
const ClientGD = require('../models/shvClientGDModel.js');
const { check, validationResult } = require('express-validator');

// Get All Garden Designers Route
router.get("/allClientGD", (req, res) => {
  AdminGD.find().exec((err, adminGds) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvClientViewAllGardenDesigners", {
        title: "All Client Garden Designers",
        adminGds: adminGds,
      });
    }
  });
});


// Add Garden Designer Requirements Route
router.post("/addClientGDReq/:id", [
  check('ClientName')
    .matches(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)
    .withMessage('Invalid Name.. Please enter correct name !!'),
  
  check('Email')
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage('Email is not valid.. Please enter correct email !! !'),

  check('Phone')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number is not valid.. Please enter correct mobile number !! !'),
  
  check('Budget')
    .matches(/^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/)
    .withMessage('Budget is not valid.. Please enter correct budget !! !'),

 ], (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    const alert = errors.array()
    let id = req.params.id;
    AdminGD.findById(id, (err, adminGds) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("shvClientAddRequirements", {
          title: "Client Add Requirements",
          adminGds: adminGds,
          alert
        });
      }
    });

  } else {
      const GDReq = new ClientGD({
        GDName : req.body.GDName,
        ClientName : req.body.ClientName,
        Email : req.body.Email,
        Phone : req.body.Phone,
        GardenArea : req.body.GardenArea,
        Budget : req.body.Budget,
        Address : req.body.Address,
        Grass : req.body.Grass,
        Pool : req.body.Pool,
        Interlock : req.body.Interlock,
        Play : req.body.Play,
        Flower : req.body.Flower,
        Pond : req.body.Pond,
        SpecialReq : req.body.SpecialReq
      });  

      GDReq.save((err)=>{
        if(err){
          res.json({message:err.message, type:'danger'});
        } else {
          req.session.message = {
            type:'success',
            message:'Requirements Successfully Submitted'
          }
          res.redirect("/SpecificGDReq");
        }
      })
  }
});


// Get Specific Garden Designer Projects
router.get("/clientGDProj/:id", (req, res) => {
  let id = req.params.id;
  AdminGD.findById(id, (err, adminGds) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvClientAddRequirements.ejs", {
        title: "Get Specific Projects client page",
        adminGds: adminGds,
      });
    }
  });
});


// Get Specific Requirements given to the garden designer
router.get("/SpecificGDReq", (req, res) =>{
  ClientGD.find().sort({$natural: -1 }).limit(1).exec((err,clientGDReqs)=>{
    if(err){
      res.json({message:err.message})
    } else {
      res.render("shvClientViewSubmittedRequirements", {
        title:'Get Specific requirements to the garden designer',
        clientGDReqs:clientGDReqs
      });
    }
  });
});


// EDIT ROUTE
router.get("/editClientGD/:id", (req, res) => {
  let id = req.params.id;
  ClientGD.findById(id, (err, clientGD) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      if (clientGD == null) {
        res.redirect("/");
      } else {
        res.render("shvClientEditRequirements", {
          title: "Client Edit Garden Designers Requirements",
          clientGD: clientGD,
        });
      }
    }
  });
});

// Update Garden Designer route
router.post("/updateClientGD/:id", (req, res) => {
  let id = req.params.id;

  ClientGD.findByIdAndUpdate(id,
    {
      GDName : req.body.GDName,
      ClientName : req.body.ClientName,
      Email : req.body.Email,
      Phone : req.body.Phone,
      GardenArea : req.body.GardenArea,
      Budget : req.body.Budget,
      Address : req.body.Address,
      Grass : req.body.Grass,
      Pool : req.body.Pool,
      Interlock : req.body.Interlock,
      Play : req.body.Play,
      Flower : req.body.Flower,
      Pond : req.body.Pond,
      SpecialReq : req.body.SpecialReq
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Garden Designer Updated Successfully",
        };
        res.redirect("/SpecificGDReq");
      }
    }
  );
});

// Delete Garden Designer Requiremennts 

router.get('/deleteClientGDReq/:id', (req, res) => {
  let id = req.params.id;
  ClientGD.findByIdAndRemove(id, (err) =>{
    if(err){
      res.json({message: err.message});
    }else{
      req.session.message = {
        type: "info",
        message:"Garden Designer Requirements Deleted Successfully"
      };
      res.redirect("/allClientGD");
    }
  });
});

// Get All Garden Designer Requirements Route
router.get("/allClientGDReq", (req, res) => {
  ClientGD.find().exec((err, clientGDs) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("shvAdminViewAllGDRequirements", {
        title: "All Client Requirements For Garden Designers",
        clientGDs: clientGDs,
      });
    }
  });
});

//search
router.get("/searchClientGDs", (req, res) => {
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
          res.render("shvClientViewAllGardenDesigners", {
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



module.exports = router;
