
import { NextFunction, Request, Response } from "express";
const BookTable = require('../model/booksModel') 
const AuthorTable = require('../model/authorsModel')


import {
  CreateBooksValidator,
  UpdateBooksValidator,
  options,
} from "../middleware/utils";

// MONGO DB FUNCTION ===============================

export async function create_books(req: Request, res: Response) {
  try {
    const validateResult = CreateBooksValidator.validate(req.body, options);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const author_id = req.authorId;
   
    const author = await AuthorTable.findOne({_id:author_id})
    if( author){
      const newBook = await new BookTable({ ...req.body, author_id }).save()
      author.books.push(newBook);
      author.save()
      res.status(200).json({
        msg:"Successful",
        newBook
      })
     
    }
   

  


    // if( author ){
    //   const record = await BookTable.create({ ...req.body, author_id });
    //   res.status(201).json({ record, message: "Book Created Successfully" });
    // }

    // const author = await AuthorTable.findOneAndUpdate({_id: author_id}, {books: record.record}, {new: true})
    // const record = await BookTable.create({ ...req.body, author_id });

    // res.status(201).json({ record, message: "Book Created Successfully" });
  } catch (error) {
    res.json({ message: error, status: 500, route: "/create" });
  }
}

// END OF MONGO DB FUNCTION ===============================

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try { 

    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await BookTable.find().sort({'createdAt': -1}).skip(offset).limit(limit);
  
    const isJSONResp = req.headers['postman-token']
    if (isJSONResp){
        res.status(200).json({
        msg:"You have successfully fetch all Books", 
        data:record
    })
    }else{
    res.status(200)
    res.render("index", {
      title: "Books", 
      msg: "You have successfully fetch all Books",
      data: record,
    });
}
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "failed to read",
    });
  }
}

export async function getSingleBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await BookTable.findOne({_id: id });
    if (!record) {
      return res.status(404).json({
        Error: "book not found",
      });
    }

    
    const isJSONResp = req.headers['postman-token']
    if (isJSONResp){
        res.status(200).json({
      message: "Successfully gotten book information",
      record,
    });
    }else{
    res.status(200)
    res.render('components/single_book', {title:'update', record})
    }
  } catch (error) {
    res.status(500).json({
      msg: "failed get book",
      route: "/:id",
    });
  }
}


export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try { 
    const { name, icon, isPublished, bookSummary, serialNumber, bookLink } = req.body;
    const validateResult = UpdateBooksValidator.validate(req.body, options);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

 

    const record = await BookTable.findOneAndUpdate({author_id: req.authorId, _id: req.params.id}, {name, icon, isPublished, bookSummary, serialNumber, bookLink}, {new: true});
    if (!record) {
      return res.status(404).json({
        Error: "Book not found",
      });
    }
 
    res.status(200).json({
      message: `successful`,
      record: record,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "failed to update",
      route: "/",
    });
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await BookTable.findOne({ _id: id , author_id: req.authorId});
    if (!record) {
      return res.status(404).json({
        msg: `Book with Id: ${id} not found`,
      });
    }
    const deletedRecord = await record.deleteOne({ _id: id });
    return res.status(200).json({
      message: `successful`,
      deletedRecord,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed delete book",
      route: "/:id",
    });
  }
}
