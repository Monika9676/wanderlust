const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
      let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    //login after signup
    req.login(registerUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    //res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //as islogged in not triggered from home
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    });
}

