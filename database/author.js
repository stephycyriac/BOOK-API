const mongoose = require("mongoose");
//author schema

const AuthorSchema = mongoose.Schema({
    id:Number,
    name:String,
    books:[string],
});

//author model
const AuthorModel = mongoose.model(AuthorSchema);
module.exports = AuthorModel;