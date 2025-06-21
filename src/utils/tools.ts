import {Employee, EmployeeDto} from "../model/Employee.js";
import bcrypt from 'bcrypt';
import {Role} from "./timeControlTypes.js";
import {v4 as uuidv4} from 'uuid';
import {EmployeeModel} from "../model/EmployeeMongo.js";
import {configuration} from "../app-config/appConfig.js";
import jwt from "jsonwebtoken";
import {Shift} from "../model/Shift.js";

export const getError = (status: number, message: string) =>
    JSON.stringify({status, message});

export const convertEmployeeDtoToEmployee = async (dto: EmployeeDto) => {
    const employee: Employee = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        hash: await bcrypt.hash(dto.password, bcrypt.genSaltSync(10)),
        id: dto.id,
        roles: [Role.CREW],
        table_num: uuidv4()
    }
    return employee;
}

export const checkFiredEmployees = async (id: string) => {
    if (await EmployeeModel.findOne({id}))
        throw new Error(getError(409, `Employee id ${id} already exists`))
}

export const convertEmployeeToFiredEmployeeDto = (emp: Employee) => {
    return {
        firstName: emp.firstName,
        lastName: emp.lastName,
        id: emp.id,
        table_num: emp.table_num,
        fireDate: new Date()
    }
}

export const getJWT = (userId: string, roles: Role[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secret = configuration.jwt.secret;
    const options = {
        expiresIn: configuration.jwt.exp_time as any,
        subject: userId
    }
    return jwt.sign(payload, secret, options);
}

export const normalizePath = (method: string, path: string): string => {
    return method.toUpperCase() + path
        .replace(/\/+$/, '') // убираем / в конце
        .replace(/\/\d+|\/[a-f0-9-]{24}/gi, '/:param'); // заменяем id
};


export const convertToShift = (doc: any): Shift => ({
    employeeId: doc.employeeId,
    startedAt: doc.start,
    end: doc.end ?? undefined,
    breaks: doc.breaks.map((b: any) => ({
        type: b.type,
        startedAt: b.start,
        end: b.end ?? undefined
    }))
});