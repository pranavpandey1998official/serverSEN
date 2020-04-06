const express = require('express');
const router = express.Router();
const Property = require('../models/property.model');

const getProperty = async (req, res, next) => {
    try {
        const property = await Property.getAllProperty();
        res.status(200).json({
            success: true,
            property: property
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
        });
    }
};

const getPropertyById = async (req, res, next) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.getPropertyById(propertyId);
        res.status(200).json({
            success: true,
            property: property
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
        });
    }
}

const getFilteredProperty = async (req, res, next) => {
    const filter = req.body;
    try {
        const property = await Property.getFilteredProperty(filter);
        res.status(200).json({
            success: true,
            property: property
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error!"
        });
    }
} 

router.get("", getProperty);
router.get("/:id", getPropertyById);
router.post("/filter", getFilteredProperty);

module.exports = router;