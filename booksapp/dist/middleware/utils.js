"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.UpdateBooksValidator = exports.CreateBooksValidator = exports.UpdateAuthorValidator = exports.CreateAuthorValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// VALIDATOR FOR AUTHORS
exports.CreateAuthorValidator = joi_1.default.object().keys({
    author: joi_1.default.string().lowercase().required(),
    author_icon: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().required(),
    address: joi_1.default.string().lowercase().required(),
});
exports.UpdateAuthorValidator = joi_1.default.object().keys({
    author: joi_1.default.string().lowercase(),
    author_icon: joi_1.default.string(),
    age: joi_1.default.number(),
    email: joi_1.default.string(),
    password: joi_1.default.string(),
    address: joi_1.default.string(),
});
// VALIDATOR FOR BOOKS
exports.CreateBooksValidator = joi_1.default.object().keys({
    name: joi_1.default.string().lowercase().required(),
    icon: joi_1.default.string().lowercase().required(),
    isPublished: joi_1.default.boolean().required(),
    serialNumber: joi_1.default.number().required(),
    bookSummary: joi_1.default.string(),
    bookLink: joi_1.default.string(),
});
exports.UpdateBooksValidator = joi_1.default.object().keys({
    name: joi_1.default.string().lowercase(),
    icon: joi_1.default.string().lowercase(),
    isPublished: joi_1.default.boolean(),
    serialNumber: joi_1.default.number(),
    bookSummary: joi_1.default.string(),
    bookLink: joi_1.default.string(),
});
// GENERATE TOKEN 
const generateToken = (userData) => {
    const token = process.env.MY_SECRET;
    return jsonwebtoken_1.default.sign(userData, token, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    error: {
        wrap: {
            label: '',
        },
    },
};
