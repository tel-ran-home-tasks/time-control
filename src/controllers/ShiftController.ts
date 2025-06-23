import {ShiftService} from "../services/ShiftService/ShiftService.js";
import {AuthRequest, Role} from "../utils/timeControlTypes.js";
import {Response} from "express";
import {Parser} from "json2csv";
import {configuration} from "../app-config/appConfig.js";

export class ShiftController {
    constructor(private service: ShiftService) {
    }

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
            res.status(400).json({message: "Invalid break type"});
            return;
        }
        const result = await this.service.startBreak(req.userId!, type);
        res.json(result);
    };

    endBreak = async (req: AuthRequest, res: Response) => {
        const result = await this.service.endBreak(req.userId!);
        res.json(result);
    };

    getShiftSummary = async (req: AuthRequest, res: Response) => {
        const {start, end, employeeId} = req.query;
        if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
            res.status(400).json({message: "Missing or invalid date range"});
            return;
        }
        const targetId = typeof employeeId === 'string' ? employeeId : req.userId!;
        const result = await this.service.getShiftSummary(targetId, new Date(start), new Date(end));
        res.json(result);
    };

    exportShiftsToCsv = async (req: AuthRequest, res: Response) => {
        const {start, end, employeeId} = req.query;

        if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
            res.status(400).json({message: "Missing or invalid date range"});
            return;
        }

        const userId = employeeId && req.roles?.includes(Role.SUP)
            ? String(employeeId)
            : req.userId!;

        const [data, employee] = await Promise.all([
            this.service.getShiftSummary(userId, new Date(start), new Date(end)),
            configuration.accountingService.getEmployeeById(userId)
        ]);

        const parser = new Parser({
            fields: ['employeeId', 'employeeName', 'date', 'hoursWorked', 'breakTime']
        });

        const csv = parser.parse(
            data.shifts
                .filter(s => s.end)
                .map((s) => {
                    const shiftStart = new Date(s.startedAt);
                    const shiftEnd = new Date(s.end!); // `!` так как фильтруем выше

                    const hoursWorked = ((shiftEnd.getTime() - shiftStart.getTime()) / 3600000);
                    const breakTime = s.breaks.reduce((sum, b) => {
                        if (b.startedAt && b.endedAt) {
                            const start = new Date(b.startedAt);
                            const end = new Date(b.endedAt);
                            return sum + (end.getTime() - start.getTime()) / 60000;
                        }
                        return sum;
                    }, 0);
                    return {
                        employeeId: s.employeeId,
                        employeeName: `${employee.firstName} ${employee.lastName}`,
                        date: shiftStart.toISOString().split('T')[0],
                        hoursWorked: hoursWorked.toFixed(2),
                        breakTime: breakTime.toFixed(1)
                    };
                })
        );
        res.header("Content-Type", "text/csv");
        res.attachment("shift-summary.csv");
        res.send(csv);
    };
}
