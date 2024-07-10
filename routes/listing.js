const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const multer  = require('multer')
const { storage }=require("../cloudConfig.js");
const upload = multer({ storage })



const listingController=require("../controllers/listings.js");


const validateListing=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

// New Route

router.get("/new",isLoggedIn,listingController.renderNewForm);

router
    .route("/")
   .get(wrapAsync(listingController.index))
   .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
   

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


// Edit Route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;