const express = require('express');
const router = express.Router();
const Property = require('../models/property.model');
const jwt = require('jsonwebtoken');
const { getWishlistForUser } = require("../models/wishlist.model");

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
    const token = req.headers.authorization.split(" ")[1];

    try {
        const isWishlist = await getIsWishlisted(token,propertyId)

        const property = await Property.getPropertyById(propertyId);
        res.status(200).json({
            success: true,
            property: property,
            isWishlist: isWishlist
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

const getIsWishlisted = (token, propertyId) => {
    return new Promise((resolve, reject) => {
        if(!token) resolve(false);
        else {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if(err) {
                    reject(err);
                }
                const { userId } = decoded;
                getWishlistForUser(propertyId, userId).then(result => {
                    if(result.length == 0) resolve(false);
                    else resolve(true);
                }).catch(e => {
                    reject(e);
                })
            });
        }
    })
}

router.get("", getProperty);
router.get("/:id", getPropertyById);
router.post("/filter", getFilteredProperty);

module.exports = router;