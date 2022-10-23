const mongoose = require('mongoose');
const ClientGardenDesignerSchema  = new mongoose.Schema({

    GDName: {
        type: String,
        required: true,
    },
    ClientName: {
        type: String,
        required : true,
    },
    Email:{
        type: String,
        required: true,
    },
    Phone:{
        type: String,
        required: true,
    },
    GardenArea: {
        type: String,
        required: true,
    },
    Budget: {
        type: String,
        required: true,
    },
    Address:{
        type: String,
        required: true,
    },
    Grass:{
        type: String,
        required: true,
    },
    Pool:{
        type: String,
        required: true,
    },
    Interlock:{
        type: String,
        required: true,
    },
    Play:{
        type: String,
        required: true,
    },
    Flower:{
        type: String,
        required: true,
    }, 
    Pond:{
        type: String,
        required: true,
    },
    SpecialReq:{
        type: String,
        required: true,
    },
    Created: {
        type: Date,
        required: true,
        default: Date.now, 
    },
});

module.exports = mongoose.model("GardenDesignersRequirements", ClientGardenDesignerSchema);

