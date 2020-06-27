const express = require('express');
const router = express.Router();
const Review = require('../models/property_review.model');
const checkAuth = require('../middlewares/check-auth');

const getReviews = (req, res, next) => {
    const propertyId = req.params.propId;

    Review.getAllReviews(propertyId).then(reviews => {
        res.status(200).json({
            success: true,
            reviews: reviews
        });
    }).catch(err => {
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })
}

const addReview = (req, res, next) => {
    const userId = req.userId;
    const postUserId = req.body.review.userId;
    if(userId != postUserId) {
        return res.status(401).json({
            error: true,
            message: "Not authorised to perform this operation"
        })
    }

    const newReview = req.body.review;

    Review.addReview(newReview).then(reviewId => {
        res.status(200).json({
            success: true,
            reviewId: reviewId
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })
}

const editReview = (req, res, next) => {
    const updatedReviewText = req.body.reviewText;
    const reviewId = req.params.reviewId;

    Review.editReview(updatedReviewText, reviewId).then(r => {
        if(r.affectedRows == 0) {
            return res.status(400).json({
                error: true,
                message: "review does not exist"
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
}

const deleteReview = (req, res, next) => {
    const reviewId = req.params.reviewId;

    Review.deleteReview(reviewId).then(r => {
        if(r.affectedRows == 0) {
            return res.status(400).json({
                error: true,
                message: "review does not exist"
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
}

const checkAuthor = (req, res, next) => {
    const reviewId = req.params.reviewId;

    Review.getReviewById(reviewId).then(review => {
        if(review.userId != req.userId){
            return res.status(401).json({
                error: true,
                message: "Unothorised for such operation"
            });
        }
        next();
        
    }).catch(err => {
        console.log(err);
        return res.status(500).json({
            error: true, 
            message: "Database error!"
          })
    })
}

router.get("/:propId", getReviews);
router.post("", checkAuth, addReview);
router.put("/:reviewId", checkAuth, checkAuthor, editReview );
router.delete("/:reviewId", checkAuth, checkAuthor, deleteReview );

module.exports = router;