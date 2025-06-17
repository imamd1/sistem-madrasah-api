const Joi = require("joi");


const UserPayloadSchema = Joi.object({
    username: Joi.string().max(20).required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string()
})

module.exports = {UserPayloadSchema}    