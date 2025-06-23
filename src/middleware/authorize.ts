import {RequestHandler, Response, NextFunction} from "express";
import {AuthRequest, Role} from "../utils/timeControlTypes.js";
import {normalizePath} from "../utils/tools.js";

//
// export const authorize = (rules: Record<string, Role[]>, skip: string[]): RequestHandler => {
//     return (req: AuthRequest, res: Response, next: NextFunction): void => {
//         const path = req.path;
//         const method = req.method.toUpperCase();
//         const fullPath = normalizePath(method, path);
//         if (skip.includes(fullPath)) {
//             return next();
//         }
//         const allowedRoles = rules[fullPath];
//         if (!allowedRoles) {
//             res.status(403).json({message: "Route not found in permissions"});
//             return
//         }
//         const userRoles = req.roles ?? [];
//         const hasAccess = userRoles.some(role => allowedRoles.includes(role));
//         if (!hasAccess) {
//             res.status(403).json({message: "Required another role"});
//             return
//         }
//         next();
//     };
// };

export const authorize = (rules: Record<string, Role[]>, skip: string[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (req.path.startsWith('/docs')) {
            return next();
        }
        const method = req.method.toUpperCase();
        const fullPath = normalizePath(method, req.originalUrl.split('?')[0]);
        console.log("🔒 Checking:", fullPath);
        if (skip.includes(fullPath)) {
            return next();
        }


        const allowedRoles = rules[fullPath];
        if (!allowedRoles) {
            res.status(403).json({ message: "Route not found in permissions" });
            return;
        }

        const userRoles = req.roles ?? [];
        const hasAccess = userRoles.some(role => allowedRoles.includes(role));

        if (!hasAccess) {
            res.status(403).json({ message: "Required another role" });
            return;
        }

        next();
    };
};

