require("dotenv").config(); //line number one 

const express = require ("express");
const mongoose = require("mongoose");

//database
const database = require("./database/index.js");

//initialization

const booky = express();

// configuration
booky.use(express.json());

console.log(process.env.MONGO_URL);
//establish database connection 

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false,
  useCreateIndex:true,
}
).then(()=>console.log("connection estabished!!!!")); 

/* mongoose.connect('mongodb+srv://stephy8137:blXxKRvflAOmxlPK@cluster0.ffihj.mongodb.net/Booky?retryWrites=true&w=majority')
.then(()=>console.log("connection estabished!!!!")); */

//mongoose.connect('mongodb+srv://stephy8137:blXxKRvflAOmxlPK@cluster0.ffihj.mongodb.net/Booky?retryWrites=true&w=majority');
//.then(()=>console.log("connection estabished!!!!"));

/*
route               /
description       get all books
access           public
parameter         none
methods          GET
*/ 

booky.get("/" ,(req,res)=>{ 
    return res.json({books:database.books});
    });
/*
route               /is
description       get spcific book based on ISBN
access           public
parameter         ISBN
methods          GET
*/


    booky.get("/is/:isbn",(req ,res)=> {
        const getSpecificBook= database.books.filter(
            (book)=>  book.ISBN === req.params.isbn);


            if (getSpecificBook.length===0)
            {
                return res.json({
             error:`no book found for the ISBN of ${req.params.isbn}`,
                });
            }
            return res.json({book : getSpecificBook});
        });

/*
route               /c
description       get spcific book based on category
access           public
parameter         category
methods          GET
*/

booky.get("/c/:category",(req,res) =>{
    const getSpecificBook= database.books.filter((book)=> 
    book.category.includes(req.params.category)
    );
    if (getSpecificBook.length===0)
    {
        return res.json({
     error:`no book found for the category of ${req.params.category}`,
    });
    }
    return res.json({book : getSpecificBook});
    });
    
    /*
route               /author
description       get all authors
access           public
parameter        nil
methods          GET
*/

booky.get("/author",(req,res)=> {
    return res.json({authors:database.author});
});
/*
route               /author/book
description       get all authors based on books
access           public
parameter         ISBN
methods          GET
*/

booky.get("/author/book/:isbn",(req ,res)=>{
    const getSpecificAuthor= database.author.filter((author)=> 
author.books.includes(req.params.isbn)
);
if (getSpecificAuthor.length===0)
{
    return res.json({
 error:`no author found for the book of ${req.params.isbn}`,
});
}
return res.json({authors : getSpecificAuthor});
});

/*
route               /publication
description       get all publications
access           public
parameter         nil
methods          GET
*/
booky.get("/publications",(req,res)=> {
    return res.json ({publications:database.publication});
    });
    

    /*
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/book/add", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });
  });

/*
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;
    database.author.push(newAuthor);
    return res.json({ authors: database.author });
  });

  /*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.title = req.body.newBookTitle;
        return;
      }
    });
  
    return res.json({ books: database.books });
  });

  /*
Route           /book/update/author
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    // update book database
  
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        return book.author.push(parseInt(req.params.authorId));
      }
    });
  
    // update author database
  
    database.author.forEach((author) => {
      if (author.id === parseInt(req.params.authorId))
        return author.books.push(req.params.isbn);
    });
  
    return res.json({ books: database.books, author: database.author });
  });

   /*
Route           /publication/update/book
Description     update/add new book to a publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn",(req,res)=>
{

    //update pubication database
    database.publications.forEach((publication)=>{
if(publication.id===req.body.pubId){
   return publication.books.push(req.params.isbn);
}
    });
//update the book database
database.books.forEach((book)=>{
if(book.ISBN===req.params.isbn){
    book.publication=req.body.pubId;
    return;
}
}); 
return res.json({
    books:database.books,
    publications:databse.publications,
    message:"successfully updated publication",
});

});


   /*
Route           /book/delete
Description    delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn",(req,res)=>{

//replace the whole database   ----> filter

const updatedBookDatabase = database.books.filter((book)=>
book.ISBN !== req.params.isbn);

database.books = updatedBookDatabase;
return res.json({books:database.books});

//edit at single point directly to master database


});

   /*
Route           /book/delete/author
Description    delete an  author from a book
Access          PUBLIC
Parameter       isbn , author id
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{

//update the book database
database.books.forEach((book)=>{
  if(book.ISBN===req.params.isbn){
    const newAuthorList = book.author.filter(
      (authors)=>authors!==parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
  }
});

//update the author database
database.author.forEach((authors)=>{
if(authors.id===parseInt(req.params.authorId)) {
  const newBooksList = authors.books.filter( 
  (book)=> book !==req.params.isbn
  );
authors.books = newBooksList;
return;
}
});

return res.json({
  message:"author was deleted",
book:database.books,
authors:database.author,
});
});


/*
Route           /publication/delete/book
Description    delete a book from publication
Access          PUBLIC
Parameter       isbn , publication id
Methods         DELETE
*/

booky.delete("/publication/delete/book/:isbn/:pubId",(req,res)=>
{
//update publication database
database.publication.forEach((publications)=>{
  if(publications.id === parseInt(req.params.pubId))
  {
    const newBooksList = publications.books.filter(
      (book)=> book !== req.params.isbn
    );

publications.books = newBooksList;
return; 

  }
});
//update book database

database.books.forEach((book)=>{
  if(book.ISBN === req.params.isbn)
  {
book.publications = 0;  //no publication available
return;
  }
});

return res.json({
  books:database.books,
  publications:  database.pubications,
}); 
});



booky.listen(3000,() => console.log("Hey server is running "));


  