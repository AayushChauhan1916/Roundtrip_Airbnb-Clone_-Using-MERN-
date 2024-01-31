const express = require("express");

const router = express.Router();

// const User = require("../Models/user.js");

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controller/usercontroller.js")

const {saveRedirectUrl} = require("../middleware.js");

router.route("/signup")
    .get(userController.signUpForm)
    .post(wrapAsync(userController.signUp))

router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)

router.get("/logout",userController.logOut)

module.exports = router;