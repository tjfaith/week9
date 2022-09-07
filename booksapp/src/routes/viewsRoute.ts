
import express from 'express';
import {getBooks} from '../controller/booksController'
import {adminData} from '../controller/authorsController'
import {verifyToken} from '../middleware/auth'

const router = express.Router();

/* GET home page. */

  // res.render('index', { title: 'Express' });


  router.get('/', getBooks)
  router.get('/admin', verifyToken, adminData)


router.get('/signup', (req:express.Request, res:express.Response)=>{
  if(req.cookies.authorized){
    return  res.redirect('/admin')
  }
  res.render('signup', {title:'signup'})
})

router.get('/login', (req, res)=>{  
  if(req.cookies.authorized){
    return  res.redirect('/admin')
  }
  res.render('login', {title:'login'})

})

// router.get('/book/:id')
router.get('/dashboard', (req, res)=>{
  res.render('dashboard', {title:"Author's Page"})
})
export default router;  
