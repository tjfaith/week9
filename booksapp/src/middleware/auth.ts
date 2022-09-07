import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; 
const AuthorTable = require('../model/authorsModel')

// generate token
export const generateToken = (authorData: { [key: string]: unknown }) => {
  return jwt.sign({ authorData }, process.env.MY_SECRET as string, {
    expiresIn: "1d",
  });
};

// verify token
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerHeader = req.cookies.authorized; 

    if (!bearerHeader) {
      return  res.status(404).json({ Error: "Author not verified" });
      // return res.redirect("/");
    }

    const token = bearerHeader;
    // const token = authorization?.slice(7, authorization.length) as string
    let verified = jwt.verify(token, process.env.MY_SECRET as string);
    if (!verified) {
      // return res.redirect("/");

      return res.status(403).json({ Error: "Unauthorized user" })
    }

    const { authorData } = verified as Record<string, string>;
  
    const author = await AuthorTable.findOne({ _id: authorData });
    if (!author) {
    console.log('@42', author);

      return res.status(403).json({ Error: "Author not verified" });

      // return res.redirect("/");
    }
    
    req.authorId = authorData;
    next();
  } catch (error) {
    res.status(500).json({ Error: "Author not verified" });
    // res.redirect("/") 
  }
}

export async function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.authorized;
    let verified = jwt.verify(token, process.env.MY_SECRET as string);
    if (verified) {
    const { authorData } = verified as Record<string, string>;
      const author = await AuthorTable.findOne({ _id: authorData });
      res.locals.loggedIn = author
      next()
    }else{
      res.locals.loggedIn = null
      next()
    }
  } catch (error) {
    console.log(error);
    
    res.locals.loggedIn = null
    next()
  }
}
