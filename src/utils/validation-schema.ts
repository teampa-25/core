import Joi from "joi"

export const UserSchema = {
    createUser: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        credits: Joi.number().min(0).required(),
        role: Joi.string().required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
}