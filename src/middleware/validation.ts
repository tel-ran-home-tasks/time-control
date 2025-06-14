import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {getError} from "../utils/tools.js";



export const validate = (target: 'body' | 'query', joiSchemas: Record<string, Joi.ObjectSchema>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const endpoint = req.method + req.baseUrl + req.route.path;
        const schema = joiSchemas[endpoint];
        if (!schema) throw new Error(getError(500, "Validation schema not found"));
        const data = target === 'body' ? req.body : req.query;
        const { error } = schema.validate(data);
        if (error) throw new Error(getError(400, error.message));
        next();
    };
