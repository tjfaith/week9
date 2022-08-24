// catch error
import createError from "http-errors";

import express, { Request, Response, NextFunction } from "express";
import cors from 'cors'
// resolve path
import path from "path";

// for catching cookies
import cookieParser from "cookie-parser";

// for showing response status on the console
import logger from "morgan";
import db from './config/database.config';
import {checkUser} from './middleware/auth'

// Router import
import indexRouter from "./routes/viewsRoute";
import bookRouter from "./routes/book";
import authorRouter from "./routes/authors";
// {force:true}

db.sync({force:true}).then(()=>{
  console.log('Database Connected Successfully');
}).catch(error=>{
  console.log(error);
  
})


// Live reload for eje template 
import livereload from "livereload";
import connectLivereload from "connect-livereload";

const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, "..", "public"));
liveReloadServer.server.once("connection", ()=>{
  setTimeout(()=>{
    liveReloadServer.refresh("/")
  },100)
})

const app = express();

app.use(connectLivereload());
// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join("public")));

// base route
app.get('*', checkUser)
app.use("/", indexRouter);
app.use("/books", bookRouter);
app.use("/author", authorRouter);

app.use(function (req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
