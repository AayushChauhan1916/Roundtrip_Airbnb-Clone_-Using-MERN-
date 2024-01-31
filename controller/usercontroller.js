const User = require("../Models/user")

module.exports.signUpForm = (req,res)=>{
    res.render("./listings/signup.ejs");
};

module.exports.signUp = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newuser = new User({
            email : email,
            username : username
        })
        let registerUser = await User.register(newuser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to Roundtrip !!")
            res.redirect("/listings")
        })
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup")
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("./listings/login.ejs")
};

module.exports.login = async(req,res)=>{
    req.flash("success","welcome! You Successfully Logged In")
    const redirectUrl = res.locals.redirectUrl || "listings";
    res.redirect(redirectUrl)
};

module.exports.logOut = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are logged out")
        res.redirect("/listings")
    });
};