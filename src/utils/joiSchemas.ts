import Joi from 'joi'
import {Role} from "./timeControlTypes.js";

export const EmployeeDtoSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    id: Joi.string().length(9).required(),
})

export const RoleSchema = Joi.object({
    newRole: Joi.string().valid(...Object.values(Role)).required()
});

export const PasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required()
});

export const DateRangeSchema = Joi.object({
    start: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    end: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
});

export const LoginSchema = Joi.object({
    id: Joi.string().length(9).required(),
    password: Joi.string().min(8).required()
});


export const joiSchemas = {
    'POST/accounts': EmployeeDtoSchema,
    "PUT/accounts/:param": EmployeeDtoSchema,
    "PATCH/accounts/:param/password": PasswordSchema,
    "PATCH/accounts/:param/role": RoleSchema,
    "GET/accounts/fired/range": DateRangeSchema,
    "POST/accounts/login": LoginSchema,
}