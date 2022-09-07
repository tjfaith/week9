"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const authorSchema = new Schema({
    author: { type: String, required: true },
    author_icon: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    books: [{ type: Schema.Types.ObjectId, ref: "Books" }]
    // books:[{ 
    //     books_id:String,
    //     data:{
    //         type:Schema.Types.ObjectId,
    //         ref:function(doc:Record<string, unknown>){
    //             return doc.books_id
    //         }
    //     }
    // }]
}, { timestamps: true });
const Author = mongoose_1.default.model("Author", authorSchema);
module.exports = Author;
