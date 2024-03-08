const mongoose=require("mongoose");
const initData=require("../init/data.js"); //data  
const Listing = require("../models/listing.js");//schema
//connection
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log('connected mongoose');
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
//enter data
const initDB=async()=>{
    await Listing.deleteMany({});  //clear all data
    initData.data=initData.data.map((obj)=>({...obj,owner:"65c797919c02fb55509d28e6"}))
    await Listing.insertMany(initData.data); //initialize data with sample data
    console.log("Data was initialized!");
}
initDB();