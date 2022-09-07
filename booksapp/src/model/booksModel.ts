import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name:{type: String, required: true},
    icon:{type: String, required: true},
    bookSummary:{type: String, required: true},
    bookLink:{type: String, required: true},
    isPublished:{type: Boolean, required: true}, 
    serialNumber:{type: Number, required: true},
    author_id:{type:Schema.Types.ObjectId, ref:'Author'},
    // author:{type:Schema.Types.ObjectId, ref:"Author" }
},{timestamps: true})

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;