import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {getError} from "../utils/tools.js";

export const validateBody = (joiSchemas: Record<string, Joi.ObjectSchema>) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body) {
            const endpoint = req.method + req.baseUrl + req.route.path;
            const schema = joiSchemas[endpoint]
            if (!schema) throw new Error(getError(500, "Validation schema not found"));
            const {error} = schema.validate(req.body)
            if (error) throw new Error(getError(400, error.message))
        }
        next();
    }