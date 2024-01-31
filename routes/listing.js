const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

// const {listingSchema} = require("../Scheamvalidation.js");

const {isLoggedIn,isOwner} = require("../middleware.js");

const listingcontroller = require("../controller/listingcontroller.js");

const multer = require('multer');

const {storage} = require('../cloudconfig.js');

const upload = multer({ storage })

// const validateSchema = (req,res,next) =>{
//     let {err} = listingSchema.validate(req.body);
//     if(err){
//         throw new ExpressError(400 , err)
//     }else{
//         next()
//     }
// };

router.route("/")
    .get(wrapAsync(listingcontroller.allListings))
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingcontroller.newListing));
    
    


router.get("/new",isLoggedIn,listingcontroller.newLisitngForm);

router.route("/:id")
    .get(wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingcontroller.editListing));


// Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editListingForm));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing))


module.exports = router;