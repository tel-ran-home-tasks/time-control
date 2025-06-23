import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {getError, normalizePath} from "../utils/tools.js";


// export const validate = (target: 'body' | 'query', joiSchemas: Record<string, Joi.ObjectSchema>) =>
//     (req: Request, res: Response, next: NextFunction) => {
//             const method = req.method;
//             const baseUrl = req.baseUrl || '';
//             const routePath = req.route?.path || '';
//             const endpoint = method + baseUrl + routePath;
//             const schema = joiSchemas[endpoint];
//             if (!schema) {
//                     throw new Error(getError(404, "Validation schema not found"));
//             }
//             const data = target === 'body' ? req.body : req.query;
//             const { error } = schema.validate(data);
//             if (error) {
//                     throw new Error(getError(400, error.message));
//             }
//             next();
//     };

export const validate = (target: 'body' | 'query', joiSchemas: Record<string, Joi.ObjectSchema>) =>
    (req: Request, res: Response, next: NextFunction) => {
        const method = req.method.toUpperCase();
        const path = req.baseUrl + req.path;
        const endpoint = normalizePath(method, path);



        const schema = joiSchemas[endpoint];
        if (!schema) {
            throw new Error(getError(404, "Validation schema not found"));
        }

        const data = target === 'body' ? req.body : req.query;
        const { error } = schema.validate(data);
        if (error) {
            throw new Error(getError(400, error.message));
        }

        next();
    };

