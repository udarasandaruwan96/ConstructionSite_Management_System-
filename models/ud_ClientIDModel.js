const mongoose = require("mongoose");
const ClientInteriorDesignerSchema = new mongoose.Schema({
  InteriorName: {
    type: String,
    required: true,
  },
  ClientName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: Number,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  ThemeColour: {
    type: String,
    required: true,
  },
  RoofColour: {
    type: String,
    required: true,
  },
  FloorColour: {
    type: String,
    required: true,
  },
  Funiture: {
    type: String,
    required: true,
  },
  Pantry: {
    type: String,
    required: true,
  },
  Deco: {
    type: String,
    required: true,
  },
  Budget: {
    type: Number,
    required: true,
  },
  SpecialReq: {
    type: String,
    required: true,
  },
  Created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "InteriorDesignersRequirements",
  ClientInteriorDesignerSchema
);
