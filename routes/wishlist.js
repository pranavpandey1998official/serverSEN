const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist.model');
const checkAuth = require('../middlewares/check-auth');

const getWishlist = (req, res, next) => {
    const userId = req.userId;

    Wishlist.getWishlist(userId).then(results => {
        res.status(200).json({
            success: true,
            wishlist: results
        });
    }).catch(err => {
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    });
};

const addWishlist = (req, res, next) => {
    const userId = req.userId;
    const postUserId = req.body.wishlist.userId;
    if(userId != postUserId) {
        return res.status(401).json({
            error: true,
            message: "Not authorised to perform this operation"
        })
    }

    const newWishlist = req.body.wishlist;

    Wishlist.addToWishlist(newWishlist).then(_ => {
        res.status(200).json({
            success: true
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })
}

const deleteWishlist = (req, res, next) => {
    const userId = req.userId;
    const propertyId = req.params.propId;

    Wishlist.deleteFromWishlist(userId, propertyId).then(r => {
        if(r.affectedRows == 0) {
            return res.status(400).json({
                error: true,
                message: "wishlist does not exist"
            });
        }
        res.status(200).json({
            success: true
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })
};

// const checkAuthor = (req, res, next) => {
//     const propertyId = req.params.propId;
//     const userId = req.params.userId;

//     Wishlist.getWishlistFromPropertyId(propertyId, userId).then(value => {
//         if(value.userId != req.userId){
//             return res.status(401).json({
//                 error: true,
//                 message: "Unothorised for such operation"
//             });
//         }
//         next();
        
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({
//             error: true, 
//             message: "Database error!"
//           })
//     })
// }

router.get("", checkAuth, getWishlist);
router.post("", checkAuth, addWishlist);
router.delete("/:propId", checkAuth, deleteWishlist);

module.exports = router;