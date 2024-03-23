if(process.env.NODE_ENV!="production"){
  require('dotenv').config()  
}
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const methodOverride=require('method-override');
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const {isLoggedIn,validateListing,isOwner}=require("./middleware.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLASDB_URL;

const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const wrapAsync = require('./utils/wrapAsync.js');


main()
.then(()=>{
    console.log('connected mongoose');
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}
// async function main(){
//       await mongoose.connect(mongoUrl);
// }
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



// app.get('/',(req,res)=>{
//     res.send("Hi! I am on root");
// });

//session-store
const store=MongoStore.create({
    mongoUrl:dbURL,
    Crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});
//sessions
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};
store.on("error",()=>{
    console.log("Error in mongo Session store,err");
})
app.use(session(sessionOptions));
app.use(flash());

//password--hasform
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for flash and user
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//middlewares
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("..//views/error.ejs",{err});
    //res.status(statusCode).send(message);
})
app.listen(8080,()=>{
    console.log('listening on port 8080');
});