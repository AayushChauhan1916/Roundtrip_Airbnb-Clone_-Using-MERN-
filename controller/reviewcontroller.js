const Review = require("../Models/review.js");

const Listing = require("../Models/listing");

module.exports.reviewPost = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newreview = new Review(req.body.review);
    newreview.createdby = req.user._id;
    listing.reviews.push(newreview)
    await listing.save()
    await newreview.save()

    req.flash("success","review created!")

    res.redirect(`/listings/${id}`);
};

module.exports.reviewDelete = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","review deleted successfully!")

    res.redirect(`/listings/${id}`);
};