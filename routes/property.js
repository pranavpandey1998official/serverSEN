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
            message: "Database error. Failed to create a user"
        });
    }
};

const getPropertyById = async (req, res, next) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.getAllPropertyById(propertyId);
        res.status(200).json({
            success: true,
            property: property
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: true, 
            message: "Database error. Failed to create a user"
        });
    }
}

const getFilteredProperty = async (req, res, next) => {
    const filter = req.body.filter;
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
            message: "Database error. Failed to create a user"
        });
    }
} 

router.get("", getProperty);
router.get("/:id", getPropertyById);
router.post("/filter", getFilteredProperty);

module.exports = router;