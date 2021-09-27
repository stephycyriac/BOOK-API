const mongoose = require("mongoose");

//creating a book schema

const BookSchema = mongoose.Schema({
ISBN:String,
title:String,
pubDate:String,
language:String,
author:[Number],
numPage:Number,
category:[String], 
publications:Number,
});

//create a  book model

const BookModel = mongoose.model("books ",BookSchema);
module.exports = BookModel;