const express = require("express");

const router = express.Router({mergeParams:true});

const {reviewSchema} = require("../Scheamvalidation.js");

const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,isReviewOwner} = require("../middleware.js")

const reviewController = require("../controller/reviewcontroller.js")



const validateReview = (req,res,next) => {
    let {err} = reviewSchema.validate(req.body);
    if(err){
        throw new ExpressError(400,err)
    }else{
        next()
    }
}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.reviewPost));

// delete route for review

router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.reviewDelete));

module.exports = router;