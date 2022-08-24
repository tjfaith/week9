"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorModel_1 = require("../model/authorModel");
// generate token
const generateToken = (authorData) => {
    return jsonwebtoken_1.default.sign({ authorData }, process.env.MY_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
// verify token
async function verifyToken(req, res, next) {
    try {
        const bearerHeader = req.cookies.authorized;
        if (!bearerHeader) {
            //  res.status(404).json({ Error: "Author not verified" });
            return res.redirect("/");
        }
        const token = bearerHeader;
        let verified = jsonwebtoken_1.default.verify(token, process.env.MY_SECRET);
        if (!verified) {
            return res.redirect("/");
            // return res.status(403).json({ Error: "Unauthorized user" })
        }
        const { authorData } = verified;
        const author = await authorModel_1.AuthorInstance.findOne({ where: { id: authorData } });
        if (!author) {
            // return res.status(403).json({ Error: "Author not verified" });
            return res.redirect("/");
        }
        req.authorId = authorData;
        next();
    }
    catch (error) {
        res.redirect("/");
    }
}
exports.verifyToken = verifyToken;
async function checkUser(req, res, next) {
    try {
        const token = req.cookies.authorized;
        let verified = jsonwebtoken_1.default.verify(token, process.env.MY_SECRET);
        if (verified) {
            const { authorData } = verified;
            const author = await authorModel_1.AuthorInstance.findOne({ where: { id: authorData } });
            res.locals.loggedIn = author;
            next();
        }
        else {
            res.locals.loggedIn = null;
            next();
        }
    }
    catch (error) {
        console.log(error);
        res.locals.loggedIn = null;
        next();
    }
}
exports.checkUser = checkUser;
