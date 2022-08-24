import { AuthorInstance } from '../model/authorModel'
import { BookInstance } from '../model/booksModel';
import { NextFunction, Request, Response } from "express";
import {generateToken} from '../middleware/auth'
import {CreateAuthorValidator, UpdateAuthorValidator, options} from "../middleware/utils" 
import bcrypt from 'bcrypt'

// GET ALL AUTHORS
export async function getAuthors(req:Request, res:Response, next:NextFunction){
    try {
        const limit  = req.query?.limit as number | undefined
        const offset  = req.query?.offset as number | undefined
        const data = await AuthorInstance.findAndCountAll({ 
            limit,  
            offset,
            attributes:['id', 'author', 'dateRegistered', 'age', 'email','address'],
            include:[
                {
                    model: BookInstance,
                    as: 'books',
                    attributes:['id', 'name', 'isPublished', 'datePublished', 'serialNumber']
                }
            ]
        })

        res.status(200).json({
            msg:"Successful",
            totalAuthor: data.count,
            data:data.rows
        })
    } catch (error) {
        res.status(500).json({
            msg:error +"failed to read",
            route:'/'
        })
    }
}

// GET SINGLE AUTHOR
export async function getSingleAuthor(req:Request, res:Response, next:NextFunction){
    try {
        const {id} = req.params
        const data = await AuthorInstance.findOne({
            where:{id},
            attributes:['id', 'author', 'dateRegistered', 'age', 'email','address'],
            include:[
                {
                    model: BookInstance,
                    as: 'books',
                    attributes:['id', 'name', 'isPublished', 'datePublished', 'serialNumber']
                }
            ]
        }) 
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

// AUTHOR DASHBOARD
export async function adminData(req:Request, res:Response, next:NextFunction){
    try {
      
        const data = await AuthorInstance.findOne({
            where:{id:req.authorId},
            attributes:['id', 'author', 'author_icon', 'dateRegistered', 'age', 'email','address'],
            order: [["createdAt", "DESC"]],
            include:[
                {
                    model: BookInstance,
                    as: 'books', 
                    attributes:['id', 'name', 'icon', 'isPublished', 'datePublished', 'serialNumber', 'createdAt'],
                
                    
                }
            ]
        }) 
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
            route:'/:id'
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
   
    if(await AuthorInstance.findOne({where:{email:req.body.email}})){
     return res.status(409).json({
        message:"Email already Exist, please login or change email"
     })
    }
    
   await AuthorInstance.create(req.body)
   res.json({ message:'Author Created Successfully'})

   
    }catch(error){ 
     res.json({error, message:"Fail to create author", status:500, })
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
        const data = await AuthorInstance.findOne({where:{id:req.authorId}, 
            attributes:{ exclude: ['password'] }
        }) 
        if(!data){
            return res.status(404).json({
                Error:"Author not found"
            })
        }
        const updateRecord = await data.update({ 
           author:bodyData.author,
           author_icon:bodyData.author_icon,
           age:bodyData.age,
           email:bodyData.email,
           password:bodyData.password,
           address:bodyData.address
        })
        res.status(200).json({
            message:'Data updated successfully',
            record: updateRecord
        })
    } catch (error) {
        res.status(500).json({
            msg:"failed to update",
            error,
            route:'/'
        })
    }
}

// LOGIN FUNCTIONALITY
export async function loginAuthor(req:Request, res:Response, next:NextFunction){
    try {
        const data = await AuthorInstance.findOne({
            where:{email: req.body.email},
            // attributes:{ exclude: ['createdAt','updatedAt'] }
        }) 
    
        
        if(!data){
            // console.log('what is wrong with u');
            
            res.status(401).json({ 
                message:"Author not found" 
            })
            // return res.status(404).json({
            //     message:"Author not found"
            // })
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

// DELETE FUNCTIONALITY
export async function deleteAccount(req:Request, res:Response, next:NextFunction){
    try {
        // const {id} = req.params
        const authorData = await AuthorInstance.findOne({where:{id:req.authorId}}) 
        if(!authorData){
            return res.status(404).json({
                message:`Oops! an error ocured`
            })
        }

        await AuthorInstance.destroy({where:{id:req.authorId}})
        await BookInstance.destroy({where:{author_id:req.authorId}})
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