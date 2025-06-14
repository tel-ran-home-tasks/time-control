import {Employee, EmployeeDto} from "../model/Employee.js";
import bcrypt from 'bcrypt';
import {Role} from "./timeControlTypes.js";
import {v4 as uuidv4} from 'uuid';
import {EmployeeModel} from "../model/EmployeeMongo.js";

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
        fireDate: new Date().toISOString()
    }
}