let Listing = require("./Models/listing")
let Review = require("./Models/review")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must login first to do so!");
        return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exit in the database");
        return res.redirect("/listings")
    }
    if(!listing.owner._id.equals(res.locals.user._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isReviewOwner = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.createdby._id.equals(res.locals.user._id)){
        req.flash("error","You are not able to delete others review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
// module.exports.isListing = async (req,re)