import { ShiftService } from "../services/ShiftService/ShiftService.js";
import { AuthRequest } from "../utils/timeControlTypes.js";
import { Response } from "express";

export class ShiftController {
    constructor(private service: ShiftService) {}

    startShift = async (req: AuthRequest, res: Response) => {
        const result = await this.service.startShift(req.userId!);
        res.json(result);
    };

    endShift = async (req: AuthRequest, res: Response) => {
        const result = await this.service.endShift(req.userId!);
        res.json(result);
    };

    startBreak = async (req: AuthRequest, res: Response) => {
        const type = req.params.type;
        if (type !== '15m' && type !== '30m') {
            res.status(400).json({ message: "Invalid break type" });
            return;
        }
        const result = await this.service.startBreak(req.userId!, type);
        res.json(result);
    };

    endBreak = async (req: AuthRequest, res: Response) => {
        const result = await this.service.endBreak(req.userId!);
        res.json(result);
    };
}
