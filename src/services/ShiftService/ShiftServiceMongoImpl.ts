import {ShiftService} from "./ShiftService.js";
import {ShiftModel} from "../../model/ShiftMongo.js";
import {convertToShift} from "../../utils/tools.js";

export class ShiftServiceMongoImpl implements ShiftService {
    async startShift(employeeId: string) {
        const existing = await ShiftModel.findOne({employeeId, end: null});
        if (existing) throw new Error("Shift already started");
        const shift = await new ShiftModel({employeeId, start: new Date().toISOString(), breaks: []}).save();
        return convertToShift(shift);
    }

    async endShift(employeeId: string) {
        const shift = await ShiftModel.findOne({employeeId, end: null});
        if (!shift) throw new Error("No active shift");
        shift.end = new Date().toISOString();
        await shift.save();
        return convertToShift(shift);
    }

    async startBreak(employeeId: string, type: '15m' | '30m') {
        const shift = await ShiftModel.findOne({employeeId, end: null});
        if (!shift) throw new Error("No active shift");
        shift.breaks.push({type, startedAt: new Date().toISOString()});
        await shift.save();
        return convertToShift(shift);
    }

    async endBreak(employeeId: string) {
        const shift = await ShiftModel.findOne({employeeId, end: null});
        if (!shift) throw new Error("No active shift");
        const active = shift.breaks.find(b => !(b as any).end);
        if (!active) throw new Error("No active break");
        active.set('endedAt', new Date().toISOString());
        await shift.save();
        return convertToShift(shift);
    }

    async getShiftSummary(employeeId: string, start: Date, end: Date) {
        const shifts = await ShiftModel.find({employeeId, start: {$gte: start.toISOString(), $lte: end.toISOString()}});
        let totalWorkMs = 0;
        let totalBreakMs = 0;
        shifts.forEach(shift => {
            const start = new Date(shift.start);
            const end = new Date(shift.end || new Date());
            totalWorkMs += end.getTime() - start.getTime();
            shift.breaks.forEach(b => {
                if (b.startedAt && b.endedAt) {
                    const bStart = new Date(b.startedAt);
                    const bEnd = new Date(b.endedAt);
                    totalBreakMs += bEnd.getTime() - bStart.getTime();
                }
            });
        });
        return {
            totalWorkHours: +(totalWorkMs / (1000 * 60 * 60)).toFixed(2),
            totalBreakMinutes: +(totalBreakMs / (1000 * 60)).toFixed(2),
            shifts: shifts.map(convertToShift)
        };
    }

}
