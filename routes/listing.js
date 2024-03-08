const express=require("express");
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");
const listingContoller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//index route & add route
router.route("/")
.get(wrapAsync(listingContoller.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingContoller.createListing));
//filtering
router.get("/filter",wrapAsync(listingContoller.filter));
//search
router.get("/search",wrapAsync(listingContoller.search));
//new route-form
router.get("/new",isLoggedIn,listingContoller.renderNewForm);

//show route & update
router.route("/:id")
.get(wrapAsync(listingContoller.showListing))
.put(isLoggedIn,isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingContoller.updateListing));

//edit route
router.get("/:id/edit",isLoggedIn,
isOwner,wrapAsync(listingContoller.renderEditForm));

//delete route
router.delete("/:id",isLoggedIn,isOwner,
wrapAsync(listingContoller.destroyListing));

module.exports=router;