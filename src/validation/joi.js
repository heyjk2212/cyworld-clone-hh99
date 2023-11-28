import Joi from "joi";

const UserSchema = Joi.object({
    id : Joi.string().min(1).max(15).alphanum().required(),
    password : Joi.string().min(1).max(15).required(),
    name : Joi.string().min(1).max(30).required(),
    nickname : Joi.string().min(1).max(10).required()
})

export {UserSchema};