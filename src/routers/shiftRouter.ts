import { Router } from "express";
import { ShiftServiceMongoImpl } from "../services/ShiftService/ShiftServiceMongoImpl.js";
import { ShiftController } from "../controllers/ShiftController.js";

const shiftService = new ShiftServiceMongoImpl();
const controller = new ShiftController(shiftService);

export const shiftRouter = Router();
shiftRouter.post('/start', controller.startShift);
shiftRouter.patch('/end', controller.endShift);
shiftRouter.patch('/break/start/:type', controller.startBreak);
shiftRouter.patch('/break/end', controller.endBreak);
shiftRouter.get('/summary',controller.getShiftSummary);
shiftRouter.get('/export/csv',controller.exportShiftsToCsv)
