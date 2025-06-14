import {Role} from "../utils/timeControlTypes.js";

export type Employee = {
    firstName: string,
    lastName: string,
    id: string,
    table_num: string
    hash: string,
    roles: Role[]
}

export type EmployeeDto = {
    firstName: string,
    lastName: string,
    password: string,
    id: string
}

export type SavedFiredEmployee = {
    firstName: string,
    lastName: string,
    id: string,
    date?:string
}