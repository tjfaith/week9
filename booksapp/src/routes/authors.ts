import express from 'express';
import {createAuthor, getSingleAuthor, updateAuthor, deleteAccount, loginAuthor, logoutAuthor, getAuthors} from '../controller/authorsController'
const router = express.Router();
import {verifyToken} from '../middleware/auth'
/* GET users listing. */
router.get('/authors', getAuthors)
router.get('/logout', logoutAuthor)
router.get('/', getAuthors)
router.get('/:id', getSingleAuthor)
router.post('/signup', createAuthor)
router.post('/login' , loginAuthor)

router.put('/update', verifyToken, updateAuthor)
router.delete('/delete', verifyToken, deleteAccount)

export default router;
