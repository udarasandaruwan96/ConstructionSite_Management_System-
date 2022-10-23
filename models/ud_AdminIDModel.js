const mongoose = require("mongoose");
const InteriorDesignerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Qualifications: {
    type: String,
    required: true,
  },
  ProfilePicture: {
    type: String,
    required: true,
  },
  FirstProjectPicture: {
    type: String,
    required: true,
  },
  FirstProjectDiscrip: {
    type: String,
    required: true,
  },
  SecondProjectPicture: {
    type: String,
  },
  SecondProjectDiscrip: {
    type: String,
  },
  ThirdProjectPicture: {
    type: String,
  },
  ThirdProjectDiscrip: {
    type: String,
  },
  Created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "InteriorDesigners",
  InteriorDesignerSchema
);
