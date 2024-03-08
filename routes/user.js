const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");
const { route } = require("./listing.js");

//signup form and post
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//login form and post
router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl,
  passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
}),userController.login);

//logout
router.get("/logout",userController.logout);

module.exports=router;