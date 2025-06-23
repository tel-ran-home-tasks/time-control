import {AuthRequest, Role} from "../utils/timeControlTypes.js";
import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken";
import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {NextFunction, Response, RequestHandler} from "express";
import {configuration} from "../app-config/appConfig.js";

const BASIC = "Basic ";
const BEARER = "Bearer ";

async function basicAuth(header: string, req: AuthRequest, service: AccountingService) {
    const authToken = Buffer.from(header.substring(BASIC.length), 'base64').toString('ascii');
    const [username, password] = authToken.split(":");

    if (username === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.userId = "GURU";
        req.roles = [Role.SUP];
    } else {
        try {
            const account = await service.getEmployeeById(username);
            if (bcrypt.compareSync(password, account.hash)) {
                req.userId = username;
                req.roles = account.roles;
                console.log("reader authenticated");
            }
        } catch (e) {
            console.log("reader not authenticated");
        }
    }
}

async function jwtAuth(header: string, req: AuthRequest) {
    const token = header.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
        req.userId = payload.sub as string;
        req.roles = JSON.parse(payload.roles as string);
    } catch (e) {
        console.log("reader not authenticated by JWT");
    }
}

export const authenticate = (service: AccountingService): RequestHandler => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const header = req.header('Authorization');
        if (header) {
            if (header.startsWith(BASIC)) {
                await basicAuth(header, req, service);
            } else if (header.startsWith(BEARER)) {
                await jwtAuth(header, req);
            }
        }
        next();
    };
};

export const skipRoutes = (skipRoutes: string[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.path.startsWith('/docs')) return next();
        const pathMethod = req.method + req.path.replace(/\/+$/, "");
        if (!skipRoutes.includes(pathMethod) && !req.userId) {
            throw new Error(JSON.stringify({status: 401, message: "Go and login!"}));
        }
        next();
    };
};
