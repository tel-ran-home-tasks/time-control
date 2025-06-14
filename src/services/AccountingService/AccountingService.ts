import {Employee, EmployeeDto, SavedFiredEmployee} from "../../model/Employee.js";

export interface AccountingService {
    hireEmployee: (employee: Employee) => Promise<Employee>;
    fireEmployee: (empId:string) => Promise<SavedFiredEmployee>;
    updateEmployee: (id:string,employee: EmployeeDto) => Promise<Employee>;
    changePassword:  (empId:string , newPassword: string) => Promise<void>;
    getEmployeeById: (id: string) => Promise<Employee>;
    getAllEmployees: () => Promise<SavedFiredEmployee[]>;
    setRole:(emplId:string,newRole:string) => Promise<Employee>;
    getFiredEmployees: () => Promise<SavedFiredEmployee[]>;
    getFiredBetween:(d: string, d2: string)=> Promise<SavedFiredEmployee[]>;
}