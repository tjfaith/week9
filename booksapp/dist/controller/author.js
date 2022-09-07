"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authors = void 0;
const Author = require('../model/author');
async function authors(req, res, next) {
    try {
        // console.log(Author.find())
        // res.status(200).json({'msg':'success'})
        const Authors = await Author.find();
        res.status(200).json(Authors);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err + "failed to read",
            route: '/'
        });
        // next(err)
    }
}
exports.authors = authors;
