const mongoose = require("mongoose");
const {Schema} = mongoose;

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    createdate : {
        type : Date,
        default : Date.now()
    },
    createdby :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model("Review",reviewSchema);