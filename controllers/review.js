const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);
     let listing=await Listing.findById(req.params.id);
     
     let newReview=new Review(req.body.review);
     newReview.author=req.user._id;
     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     //flash msg
    req.flash("success","New Review created!");
     // console.log("new review saved");
     // res.send("new review saved!!");
      res.redirect(`/listings/${listing._id}`);
 }
 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId} = req.params;
    //delete from listings
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    //delete from reviews
    await Review.findByIdAndDelete(reviewId);
    //flash msg
   req.flash("success","Listing Deleted!");
    //res.send("Deleted review");
   res.redirect(`/listings/${id}`);
}