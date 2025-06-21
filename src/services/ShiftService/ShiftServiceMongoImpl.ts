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
}
