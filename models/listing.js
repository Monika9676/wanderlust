const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");
//schema and model
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String
    },
    description:String,
    price:Number,
    location:String,
    country:String,
    category:{
        type:String,
        enum:["Trending","Rooms","IconicCities","Mountains","Castles","AmazingPools","Camping","Farms","Arctic"]
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

//middleware for review-listing
//removing dependent documents--hooks(pre,post)
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model('Listing',listingSchema);


module.exports=Listing;