import mongoose  from "mongoose";
const Schema = mongoose.Schema;  
 
const authorSchema = new Schema({
    author:{type: String, required: true},
    author_icon: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    books:[{ type:Schema.Types.ObjectId, ref:"Book" }]
    // books:[{ 
    //     books_id:String,
    //     data:{
    //         type:Schema.Types.ObjectId,
    //         ref:function(doc:Record<string, unknown>){
    //             return doc.books_id
    //         }
    //     }
    // }]
}, {timestamps: true})

const Author =  mongoose.model("Author", authorSchema);
module.exports = Author;