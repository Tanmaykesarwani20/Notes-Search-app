const Joi = require('joi');

const userRegisterSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).options({ abortEarly: false });

const loginSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
}).options({ abortEarly: false });

module.exports = { userRegisterSchema, loginSchema };
