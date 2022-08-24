import { v4 as uuidv4 } from "uuid";
import { BookInstance } from "../model/booksModel";
import { NextFunction, Request, Response } from "express";
import { AuthorInstance } from '../model/authorModel'

import {
  CreateBooksValidator,
  UpdateBooksValidator,
  options,
} from "../middleware/utils";

export async function create_books(req: Request, res: Response) {
  try {
    const validateResult = CreateBooksValidator.validate(req.body, options);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const author_id = req.authorId;
    const record = await BookInstance.create({ ...req.body, author_id });

    res.status(201).json({ record, message: "Book Created Successfully" });
  } catch (error) {
    res.json({ message: error, status: 500, route: "/create" });
  }
}

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await BookInstance.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      include:[
        {
            model: AuthorInstance,
            as: 'author',
            attributes:['id', 'author']
        }
    ]
    });
  
    const isJSONResp = req.headers['postman-token']
    if (isJSONResp){
        res.status(200).json({
        msg:"You have successfully fetch all Books",
        totalBooks: record.count,
        data:record.rows
    })
    }else{
    res.status(200)
    res.render("index", {
      title: "Books",
      totalBooks: record.count,
      msg: "You have successfully fetch all Books",
      data: record.rows,
    });
}
  } catch (error) {
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
    const record = await BookInstance.findOne({ 
      where: { id },
      include:[
        {
            model: AuthorInstance,
            as: 'author',
            attributes:['id', 'author']
        }
    ] 
    });
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
    const { id } = req.params;
    const { name, icon, isPublished, bookSummary, serialNumber, bookLink } = req.body;
    const validateResult = UpdateBooksValidator.validate(req.body, options);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const record = await BookInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        Error: "Book not found",
      });
    }
    const updateRecord = await record.update({
      name,
      icon,
      isPublished,
      bookSummary,
      serialNumber,
      bookLink
    });
    res.status(200).json({
      message: `successful`,
      record: updateRecord,
    });
  } catch (error) {
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
    const record = await BookInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        msg: `Book with Id: ${id} not found`,
      });
    }
    const deletedRecord = await record.destroy();
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
