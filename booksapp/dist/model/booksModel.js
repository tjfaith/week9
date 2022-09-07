"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const bookSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    bookSummary: { type: String, required: true },
    bookLink: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    serialNumber: { type: Number, required: true },
    author_id: { type: Schema.Types.ObjectId, ref: 'Author' },
    // author:{type:Schema.Types.ObjectId, ref:"Author" }
}, { timestamps: true });
const Book = mongoose_1.default.model("Book", bookSchema);
module.exports = Book;
