import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import { AuthorInstance } from "../model/authorModel";

// generate token
export const generateToken = (authorData: { [key: string]: unknown }) => {
  return jwt.sign({ authorData }, process.env.MY_SECRET as string, {
    expiresIn: "7d",
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
      //  res.status(404).json({ Error: "Author not verified" });
      return res.redirect("/");
    }

    const token = bearerHeader;

    let verified = jwt.verify(token, process.env.MY_SECRET as string);
    if (!verified) {
      return res.redirect("/");

      // return res.status(403).json({ Error: "Unauthorized user" })
    }

    const { authorData } = verified as Record<string, string>;
    const author = await AuthorInstance.findOne({ where: { id: authorData } });
    if (!author) {
      // return res.status(403).json({ Error: "Author not verified" });
      return res.redirect("/");
    }

    req.authorId = authorData;
    next();
  } catch (error) {
    res.redirect("/") 
  }
}

export async function checkUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.authorized;
    let verified = jwt.verify(token, process.env.MY_SECRET as string);
    if (verified) {
    const { authorData } = verified as Record<string, string>;
      const author = await AuthorInstance.findOne({ where: { id: authorData } });
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
