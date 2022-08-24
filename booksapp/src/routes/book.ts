import {getBooks, updateBook, getSingleBook, create_books, deleteBook} from '../controller/booksController'
import express from 'express';
const router = express.Router();
import {verifyToken} from '../middleware/auth'

 router.get('/', getBooks)
 router.get('/:id', getSingleBook)
 router.post('/create', verifyToken, create_books)
 router.put('/update/:id',  verifyToken, updateBook)
 router.delete('/delete/:id', verifyToken, deleteBook)


export default router;  
