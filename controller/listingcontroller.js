const Listing = require("../Models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.allListings = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
};

module.exports.newLisitngForm = (req,res)=>{
    res.render("listings/form.ejs")
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing_details = await Listing.findById(id).populate({path:"reviews", populate : {path:"createdby"}}).populate("owner");
    if(!listing_details){
        req.flash("error","Listing does not exist in database");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing_details})
};  

module.exports.newListing = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        // console.log(response.body.features[0].geometry)
        // return res.send("Done");
        
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = await req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","new listing created!")
    res.redirect("/listings");
};

module.exports.editListingForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let orignalImage = listing.image.url;
    let imageResize = orignalImage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,imageResize})
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let editlisting = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        editlisting.image = {url,filename};
        await editlisting.save()
    }
    req.flash("success","listing updated successfully!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully!")
    res.redirect("/listings")
}