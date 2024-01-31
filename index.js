if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express");
const app  = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressErrors.js");


const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const userRoute = require("./routes/user.js")
const mongoUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
    .then(()=>{
        console.log("connection Successfully established")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl,{ useNewUrlParser: true, useUnifiedTopology: true });
}

const mongoClientPromise = new Promise((resolve) => {
    mongoose.connection.on("connected", () => {
        const client = mongoose.connection.getClient();
        resolve(client);
    });
});


app.listen("8080",()=>{
    console.log("port is working")
});

// session

const store =  MongoStore.create({
    mongoUrl: mongoUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchafter: 24 * 3600,
    clientPromise: mongoClientPromise,
    collection : "sessions",
});

store.on("error",(err)=>{
    console.log("error in session store",err)
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success"),
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next()
});

app.use("/listings",listingsRoute);

app.use("/listings/:id/reviews",reviewsRoute);

app.use("/",userRoute)

//  for  any other route

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Lost in space,  Hence, not found !!!"))
});

// error handler 

app.use((err,req,res,next)=>{
    let {statuscode = 500, message="something went wrong"} = err;
    res.status(statuscode).render("error.ejs",{err})
});