import {Shift} from "../../model/Shift.js";

export interface ShiftService {
    startShift: (employeeId: string) => Promise<Shift>;
    endShift: (employeeId: string) => Promise<Shift>;
    startBreak: (employeeId: string, type: '15m' | '30m') => Promise<Shift>;
    endBreak:(employeeId: string) =>  Promise<Shift>;
}
