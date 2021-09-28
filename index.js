require("dotenv").config(); //line number one 

//framework
const express = require ("express");
const mongoose = require("mongoose");

//database
// const database = require("./database/index.js");

//models
// const BookModel = require("./database/book");
// const AuthorModel = require("./database/author");
// const PublicationModel = require("./database/publication")

//microservices routes
const Books = require("./API/BOOK");
const authors = require("./API/author");
const publications = require("./API/publication");

//initialization express
const booky = express();

// configuration
booky.use(express.json());

//console.log(process.env.MONGO_URL);
//establish database connection 

/*mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false,
  useCreateIndex:true,
}
).then(()=>console.log("connection estabished!!!!")); */

/* mongoose.connect('mongodb+srv://stephy8137:blXxKRvflAOmxlPK@cluster0.ffihj.mongodb.net/Booky?retryWrites=true&w=majority')
.then(()=>console.log("connection estabished!!!!")); */

//mongoose.connect('mongodb+srv://stephy8137:blXxKRvflAOmxlPK@cluster0.ffihj.mongodb.net/Booky?retryWrites=true&w=majority');
//.then(()=>console.log("connection estabished!!!!"));


//initializing microservices
booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);








booky.listen(3000,() => console.log("Hey server is running "));


  