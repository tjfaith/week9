import { NextFunction, Request, Response } from "express";
import {generateToken} from '../middleware/auth'
import { CreateAuthorValidator, UpdateAuthorValidator, options } from "../middleware/utils" 
const AuthorTable = require('../model/authorsModel')
const BookTable = require('../model/booksModel')
const mongoose = require('mongoose') 

import bcrypt from 'bcrypt'

// MONGO DB
export async function getAuthors(req:Request, res:Response, next:NextFunction){
    try{ 

     await AuthorTable.find().populate('books').exec((err:Error,authors:Record<string, string>)=>{
       return res.status(200).json(authors);
     })


    // res.status(200).json(Authors);
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg:err +"failed to read",
            route:'/'
        })
        // next(err)
    }
}


// GET SINGLE AUTHOR
export async function getSingleAuthor(req:Request, res:Response, next:NextFunction){
    try {
        const {id} = req.params
        // const books = await BookTable.findById({author_id: req.params})
        const data = await AuthorTable.findOne({_id:id}).exec()
        
        if(!data){
            return res.status(404).json({
                Error:"Author not found"
            })
        }
        res.status(200).json({
            msg:"Successful",
            data
        })
    } catch (error) {
        res.status(500).json({
            msg:"failed get author",
            route:'/:id'
        })
    }
}

// UPDATE AUTHOR
export async function updateAuthor(req:Request, res:Response, next:NextFunction){
    try {
       const bodyData = req.body 
       
       const validateResult = UpdateAuthorValidator.validate(req.body, options)
       if(validateResult.error){ 
           return res.status(400).json({
               Error:validateResult.error.details[0].message
           })
       }

       const salt = await bcrypt.genSalt()
       bodyData.password = await bcrypt.hash(bodyData.password, salt)

       const updateRecord ={
        author:bodyData.author,
        author_icon:bodyData.author_icon,
        age:bodyData.age,
        email:bodyData.email,
        password:bodyData.password,
        address:bodyData.address
     }

        const data = await AuthorTable.findOneAndUpdate({_id:req.authorId}, updateRecord, {new:true}).select('-password')
        if(!data){
            return res.status(404).json({
                Error:"Author not found"
            })
        }
       
        res.status(200).json({
            message:'Data updated successfully',
            record: data
        })
    } catch (error) {
        res.status(500).json({
            msg:"failed to update",
            error,
            route:'/'
        })
    }
}

// CREATE NEW AUTHOR / SIGNUP
export async function  createAuthor (req:Request, res:Response){
    try{
       
    const validateResult = CreateAuthorValidator.validate(req.body, options)
    
    const salt = await bcrypt.genSalt()
    req.body.password = await bcrypt.hash(req.body.password, salt)

    if(validateResult.error){ 
        return res.status(400).json({
            Error:validateResult.error.details[0].message
        })
    }
   
    if(await AuthorTable.findOne({email:req.body.email})){
     return res.status(409).json({
        message:"Email already Exist, please login or change email"
     })
    }

    // await AuthorTable.create(req.body) 
    
    const record =  await new AuthorTable(req.body).save()
   res.json({ message:'Author Created Successfully'})

   
    }catch(error){ 
        console.log(error)
     res.json({error, message:"Fail to create author", status:500 })
    }
}


// LOGIN FUNCTIONALITY
export async function loginAuthor(req:Request, res:Response, next:NextFunction){
    try {
        const data = await AuthorTable.findOne({email: req.body.email}) 
        if(!data){
            // console.log('what is wrong with u');
            
            res.status(401).json({ 
                message:"Author not found" 
            })

        }else{
            
        if(await bcrypt.compare(req.body.password, data.password )){
            const token = generateToken(data.id) 
            res.cookie('authorized', token, { httpOnly:true, maxAge:1000*60*60*24})
           res.status(200).json({
                message:'Login successful',
                // token, 
                data:{ id: data.id, author:data.author, dateRegistered:data.dateRegistered, age:data.age, email:data.email, address:data.address }
            })
            // res.redirect('/dashboard')
        }else{
            res.status(401).json({
                message:'Invalid Login Details'
            })
        }
    }
       
    } catch (error) {
        console.log(error); 
        res.status(500).json({
            msg:"failed to get author", 
        })
    }
}

// LOGOUT FUNCTIONALITY
export async function logoutAuthor(req:Request, res:Response){
    const isJSONResp = req.headers['postman-token']
    if (isJSONResp){
        
        if(!req.cookies.authorized){
           return res.status(200).json({
                message:"successful",
            })
        }
    }else{
        if(!req.cookies.authorized){
            return res.redirect('/')
        }
    }
   
    res.cookie('authorized', '', {maxAge:1})
    res.status(200).json({
        message:"successful",
    })
}
// END MONGO DB


// DELETE FUNCTIONALITY
export async function deleteAccount(req:Request, res:Response, next:NextFunction){
    try {
        // const {id} = req.params
        const authorData = await AuthorTable.findOne({_id:req.authorId}) 
        if(!authorData){
            return res.status(404).json({
                message:`Oops! an error ocurred`
            })
        }

        await AuthorTable.deleteOne({_id:req.authorId})
        await BookTable.deleteMany({author_id:req.authorId})
        res.cookie('authorized', '', {maxAge:1})
        return res.status(200).json({
            message:`Your account has been deleted successfully`
        })
    } catch (error) {
        res.status(500).json({
            message:"failed delete Author"
        })
    }
}



// AUTHOR DASHBOARD
export async function adminData(req:Request, res:Response, next:NextFunction){
    try {
      
        const data = await AuthorTable.findOne({_id:req.authorId}, {_id:1, author:1, author_icon:1, age:1, email:1, address:1}).populate('books')
           
          // attributes:['id', 'name', 'icon', 'isPublished', 'datePublished', 'serialNumber', 'createdAt'],
                
             
        if(!data){
            return res.status(404).json({
                Error:"Author not found"
            })
        }
        const isJSONResp = req.headers['postman-token']
        if (isJSONResp){
       return res.json({
            msg:"Successful",
            data:data
        })
         }
        res.status(200)
         res.render("admin", {title:"admin", data})
       
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            msg:"failed get author",
            route:'/:id',
            error
        })
    }
}






