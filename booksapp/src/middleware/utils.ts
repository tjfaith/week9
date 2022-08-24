import Joi from "joi";
import jwt from 'jsonwebtoken'
// VALIDATOR FOR AUTHORS
export const CreateAuthorValidator = Joi.object().keys({
    author: Joi.string().lowercase().required(),
    author_icon: Joi.string().required(),
    age: Joi.number().required(),
    email:Joi.string().trim().lowercase().required(),
    password: Joi.string().required(),
    address: Joi.string().lowercase().required(),
  });
  
  export const UpdateAuthorValidator = Joi.object().keys({
      author: Joi.string().lowercase(),
      author_icon: Joi.string(),
      age: Joi.number(),
      email: Joi.string(),
      password: Joi.string(),
      address: Joi.string(),
    });

// VALIDATOR FOR BOOKS
export const CreateBooksValidator = Joi.object().keys({
  name: Joi.string().lowercase().required(),
  icon: Joi.string().lowercase().required(),
  isPublished:Joi.boolean().required(),
  serialNumber: Joi.number().required(),
  bookSummary:Joi.string(),
  bookLink:Joi.string(),
});

export const UpdateBooksValidator = Joi.object().keys({
  name: Joi.string().lowercase(),
  icon: Joi.string().lowercase(),
  isPublished:Joi.boolean(), 
  serialNumber: Joi.number(),
  bookSummary:Joi.string(),
  bookLink:Joi.string(),
});

// GENERATE TOKEN 
export const generateToken=(userData:{[key:string]:unknown})=>{
  const token =   process.env.MY_SECRET as string
  return jwt.sign(userData, token, {expiresIn:'7d'})
}

export const options = {
  abortEarly: false,
  error: {
    wrap: {
      label: '',
    },
  },
};
