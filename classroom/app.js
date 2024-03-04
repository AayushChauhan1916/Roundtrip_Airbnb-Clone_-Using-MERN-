const express = require('express');

const app = express();

const cookieParser = require("cookie-parser");

const session = require("express-session");

const path = require("path");

const flash = require("connect-flash");

app.use(session({secret : "aayush chauhan",resave : false,saveUninitialized:true}));
app.use(flash());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


app.use(cookieParser("aayush"));

app.listen(3000,(req,res)=>{
    console.log("app is working")
});

app.get('/',(req,res)=>{
    let {name = "pta nahi"} = req.query;
    req.session.name = name;
    if(name === "pta nahi"){
        req.flash("error","user not registered")
    }else{
        req.flash("success","user registered successfully")
    } 
    res.redirect("/hello")
});

app.get("/hello",(req,res)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.name = req.session.name
    console.log(res.locals)
    res.render("home.ejs")
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count = 1;
//     }
//     console.log(req.session)
//     res.send(`you make ${req.session.count} request`);
// });

app.get("/aayush",(req,res)=>{
    res.send(`RAM RAM JI`)
});