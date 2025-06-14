import {AccountingService} from "./AccountingService.js";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../../model/Employee.js";
import {checkFiredEmployees, convertEmployeeToFiredEmployeeDto, getError} from "../../utils/tools.js";
import {EmployeeModel, FiredEmployeeModel} from "../../model/EmployeeMongo.js";
import bcrypt from "bcrypt";

export class AccountingServiceMongoImpl implements AccountingService {
    async changePassword(empId: string, newPassword: string): Promise<void> {
        const hashed = await bcrypt.hash(newPassword, 10);
        const result = await EmployeeModel.updateOne({id: empId}, {$set: {password: hashed}});
        if (result.matchedCount === 0) {
            throw new Error(getError(404, `Employee with id ${empId} not found`));
        }
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const existing = await EmployeeModel.findOne({id: empId});
        if (!existing) {
            throw new Error(getError(404, `Employee with id ${empId} not found`));
        }
        await EmployeeModel.deleteOne({id: empId});
        const firedDto = convertEmployeeToFiredEmployeeDto(existing as Employee);
        const firedDoc = new FiredEmployeeModel(firedDto);
        await firedDoc.save();
        return firedDto;

    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result = await EmployeeModel.find<Employee>({})
        const employees = result.map(emp => convertEmployeeToFiredEmployeeDto(emp))

        return Promise.resolve(employees);
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await EmployeeModel.findOne({id});
        if (!employee) {
            throw new Error(getError(404, `Employee with id ${id} not found`));
        }
        return employee as Employee;
    }

    async hireEmployee(employee: Employee): Promise<Employee> {
        await checkFiredEmployees(employee.id)
        if (await EmployeeModel.findOne({id: employee.id}))
            throw new Error(getError(409, `Employee id ${employee.id} already exists`))
        const employeeDoc = new EmployeeModel(employee)
        await employeeDoc.save()
        return employeeDoc as Employee
    }

    async setRole(empId: string, newRole: string): Promise<Employee> {
        const emp = await EmployeeModel.findOneAndUpdate(
            {id: empId},
            {$set: {roles: newRole}},
            {new: true});
        if (!emp) throw new Error(getError(404, `Employee with id ${empId} not found`));
        return emp as Employee;
    }

    async updateEmployee(id: string, employee: EmployeeDto): Promise<Employee> {
        const existing = await EmployeeModel.findOne({id});
        if (!existing) {
            throw new Error(getError(404, `Employee with id ${id} not found`));
        }
        existing.firstName = employee.firstName;
        existing.lastName = employee.lastName;
        await existing.save();
        return existing as Employee;
    }

    async getFiredEmployees(): Promise<SavedFiredEmployee[]> {
        return await FiredEmployeeModel.find().lean();
    }
}