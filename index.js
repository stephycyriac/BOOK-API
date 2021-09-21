

const express = require ("express");


//database
const database = require("./database");

//initialization

const booky = express();

// configuration
booky.use(express.json());


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

booky.listen(3000,() => console.log("Hey server is running "));


  