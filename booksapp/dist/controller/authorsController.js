"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminData = exports.deleteAccount = exports.logoutAuthor = exports.loginAuthor = exports.createAuthor = exports.updateAuthor = exports.getSingleAuthor = exports.getAuthors = void 0;
const auth_1 = require("../middleware/auth");
const utils_1 = require("../middleware/utils");
const AuthorTable = require('../model/authorsModel');
const BookTable = require('../model/booksModel');
const mongoose = require('mongoose');
const bcrypt_1 = __importDefault(require("bcrypt"));
// MONGO DB
async function getAuthors(req, res, next) {
    try {
        await AuthorTable.find().populate('books').exec((err, authors) => {
            return res.status(200).json(authors);
        });
        // res.status(200).json(Authors);
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
exports.getAuthors = getAuthors;
// GET SINGLE AUTHOR
async function getSingleAuthor(req, res, next) {
    try {
        const { id } = req.params;
        // const books = await BookTable.findById({author_id: req.params})
        const data = await AuthorTable.findOne({ _id: id }).exec();
        if (!data) {
            return res.status(404).json({
                Error: "Author not found"
            });
        }
        res.status(200).json({
            msg: "Successful",
            data
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed get author",
            route: '/:id'
        });
    }
}
exports.getSingleAuthor = getSingleAuthor;
// UPDATE AUTHOR
async function updateAuthor(req, res, next) {
    try {
        const bodyData = req.body;
        const validateResult = utils_1.UpdateAuthorValidator.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = await bcrypt_1.default.genSalt();
        bodyData.password = await bcrypt_1.default.hash(bodyData.password, salt);
        const updateRecord = {
            author: bodyData.author,
            author_icon: bodyData.author_icon,
            age: bodyData.age,
            email: bodyData.email,
            password: bodyData.password,
            address: bodyData.address
        };
        const data = await AuthorTable.findOneAndUpdate({ _id: req.authorId }, updateRecord, { new: true }).select('-password');
        if (!data) {
            return res.status(404).json({
                Error: "Author not found"
            });
        }
        res.status(200).json({
            message: 'Data updated successfully',
            record: data
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            error,
            route: '/'
        });
    }
}
exports.updateAuthor = updateAuthor;
// CREATE NEW AUTHOR / SIGNUP
async function createAuthor(req, res) {
    try {
        const validateResult = utils_1.CreateAuthorValidator.validate(req.body, utils_1.options);
        const salt = await bcrypt_1.default.genSalt();
        req.body.password = await bcrypt_1.default.hash(req.body.password, salt);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        if (await AuthorTable.findOne({ email: req.body.email })) {
            return res.status(409).json({
                message: "Email already Exist, please login or change email"
            });
        }
        // await AuthorTable.create(req.body) 
        const record = await new AuthorTable(req.body).save();
        res.json({ message: 'Author Created Successfully' });
    }
    catch (error) {
        console.log(error);
        res.json({ error, message: "Fail to create author", status: 500 });
    }
}
exports.createAuthor = createAuthor;
// LOGIN FUNCTIONALITY
async function loginAuthor(req, res, next) {
    try {
        const data = await AuthorTable.findOne({ email: req.body.email });
        if (!data) {
            // console.log('what is wrong with u');
            res.status(401).json({
                message: "Author not found"
            });
        }
        else {
            if (await bcrypt_1.default.compare(req.body.password, data.password)) {
                const token = (0, auth_1.generateToken)(data.id);
                res.cookie('authorized', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
                res.status(200).json({
                    message: 'Login successful',
                    // token, 
                    data: { id: data.id, author: data.author, dateRegistered: data.dateRegistered, age: data.age, email: data.email, address: data.address }
                });
                // res.redirect('/dashboard')
            }
            else {
                res.status(401).json({
                    message: 'Invalid Login Details'
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to get author",
        });
    }
}
exports.loginAuthor = loginAuthor;
// LOGOUT FUNCTIONALITY
async function logoutAuthor(req, res) {
    const isJSONResp = req.headers['postman-token'];
    if (isJSONResp) {
        if (!req.cookies.authorized) {
            return res.status(200).json({
                message: "successful",
            });
        }
    }
    else {
        if (!req.cookies.authorized) {
            return res.redirect('/');
        }
    }
    res.cookie('authorized', '', { maxAge: 1 });
    res.status(200).json({
        message: "successful",
    });
}
exports.logoutAuthor = logoutAuthor;
// END MONGO DB
// DELETE FUNCTIONALITY
async function deleteAccount(req, res, next) {
    try {
        // const {id} = req.params
        const authorData = await AuthorTable.findOne({ _id: req.authorId });
        if (!authorData) {
            return res.status(404).json({
                message: `Oops! an error ocurred`
            });
        }
        await AuthorTable.deleteOne({ _id: req.authorId });
        await BookTable.deleteMany({ author_id: req.authorId });
        res.cookie('authorized', '', { maxAge: 1 });
        return res.status(200).json({
            message: `Your account has been deleted successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            message: "failed delete Author"
        });
    }
}
exports.deleteAccount = deleteAccount;
// AUTHOR DASHBOARD
async function adminData(req, res, next) {
    try {
        const data = await AuthorTable.findOne({ _id: req.authorId }, { _id: 1, author: 1, author_icon: 1, age: 1, email: 1, address: 1 }).populate('books');
        // attributes:['id', 'name', 'icon', 'isPublished', 'datePublished', 'serialNumber', 'createdAt'],
        if (!data) {
            return res.status(404).json({
                Error: "Author not found"
            });
        }
        const isJSONResp = req.headers['postman-token'];
        if (isJSONResp) {
            return res.json({
                msg: "Successful",
                data: data
            });
        }
        res.status(200);
        res.render("admin", { title: "admin", data });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed get author",
            route: '/:id',
            error
        });
    }
}
exports.adminData = adminData;
