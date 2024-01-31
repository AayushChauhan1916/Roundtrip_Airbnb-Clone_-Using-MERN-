const initdata = require("./data.js");
const Listing = require("../Models/listing.js");

const mongoose = require('mongoose');

main()
    .then(()=>{
        console.log("connection Successfully established")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/propLister');
}

const initDB = async ()=>{
   await Listing.deleteMany();
   initdata.data = initdata.data.map((obj)=>{
    return ({...obj,owner:"65b025dfd5c1cc3ae8e6bb73"})
  })
   await Listing.insertMany(initdata.data)
};

initDB();