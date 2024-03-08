//require
const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("..//views/listings/index.ejs",{allListings});
}
// filter
module.exports.filter=async(req,res)=>{
    const currCategory = req.query.category;
    const allListings = await Listing.find({ category: currCategory });
    res.render("..//views/listings/index.ejs",{allListings});
}
// search
module.exports.search=async(req,res)=>{
    const currCountry = req.query.country;
    const allListings = await Listing.find({ country: currCountry });
    res.render("..//views/listings/index.ejs",{allListings});
}
module.exports.renderNewForm=(req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("..//views/listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
          path:"author"
    },
   }) //Nested populate Listing--reviews--author
    .populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("..//views/listings/show.ejs",{listing});
}
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;  //assosiate curr user to its new listing
    newListing.image={url,filename};
    console.log(newListing);
    await newListing.save();
    //flash msg
    req.flash("success","New Listing created!");
    res.redirect("/listings");
    //res.redirect(req.session.redirecturl);
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
   // res.send("listening");
   
   if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
}
   let originalListingImage=listing.image.url;
   originalListingImage=originalListingImage.replace("/upload","/upload/w_250");
    res.render("..//views/listings/edit.ejs",{listing,originalListingImage});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;  
      listing.image={url,filename};
      await listing.save();
    }
    
    //flash msg
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    //flash msg
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}
