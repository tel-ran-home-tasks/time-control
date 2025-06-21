import express, {Request, Response} from "express";
import {EmployeeDto} from "../model/Employee.js";
import asyncHandler from "express-async-handler";
import {AccountController} from "../controllers/AccountController.js";
import {validate} from "../middleware/validation.js";
import {joiSchemas} from "../utils/joiSchemas.js";
import {AuthRequest, DateRangeQuery, LoginData} from "../utils/timeControlTypes.js";


export const accountRouter = express.Router();
const controller = new AccountController();
accountRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as EmployeeDto;
    const result = await controller.addEmployee(body);
    res.status(201).json(result)
}))

accountRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.getAllEmployees();
    res.json(result)
}))

accountRouter.get('/fired', asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.getFiredEmployees();
    res.json(result)
}))

accountRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.fireEmployee(req.params.id);
    res.json(result);
}));

accountRouter.put('/:id', validate('body',joiSchemas), asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body as EmployeeDto;
    const result = await controller.updateEmployee(id, body);
    res.json(result);
}));

accountRouter.patch('/:id/password', asyncHandler(async (req: Request, res: Response) => {
    const {newPassword} = req.body;
    await controller.changePassword(req.params.id, newPassword);
    res.sendStatus(204);
}));

accountRouter.patch('/:id/role', asyncHandler(async (req: Request, res: Response) => {
    const {newRole} = req.body;
    const result = await controller.setRole(req.params.id, newRole);
    res.json(result);
}));

accountRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const result = await controller.getEmployeeById(req.params.id);
    res.json(result);

}));

accountRouter.get('/fired/range', validate('query', joiSchemas), asyncHandler(async (req: Request<{}, {}, {}, DateRangeQuery>, res: Response) => {
        const { start, end } = req.query;
        const startDate = new Date(`${start}T00:00:00.000Z`);
        const endDate = new Date(`${end}T23:59:59.999Z`);
        const result = await controller.getFiredBetween(startDate, endDate);
        res.json(result);
    })
);


accountRouter.post('/login', validate('body', joiSchemas), asyncHandler(async (req:Request<{},{},LoginData>, res:Response) => {
        const token = await controller.login(req.body);
        res.json(token);
    })
);
