import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeDto} from "../model/Employee.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";

export class AccountController {
    private service: AccountingService = new AccountingServiceMongoImpl();

    async addEmployee(dto: EmployeeDto) {
        const employee = await convertEmployeeDtoToEmployee(dto);
        const result = await this.service.hireEmployee(employee)
        return result;
    }

    async getAllEmployees() {
        const result = await this.service.getAllEmployees()
        return result;
    }

    async getFiredEmployees() {
        const result = await this.service.getFiredEmployees();
        return result;
    }

    async fireEmployee(id: string) {
        return await this.service.fireEmployee(id);
    }

    async updateEmployee(id: string, dto: EmployeeDto) {
        return await this.service.updateEmployee(id, dto);
    }

    async changePassword(id: string, newPassword: string) {
        return await this.service.changePassword(id, newPassword);
    }

    async getEmployeeById(id: string) {
        return await this.service.getEmployeeById(id);
    }

    async setRole(id: string, newRole: string) {
        return await this.service.setRole(id, newRole);
    }

    async getFiredBetween(start: string, end: string) {
        const startDate = new Date(`${start}T00:00:00.000Z`);
        const endDate = new Date(`${end}T23:59:59.999Z`);
        return await this.service.getFiredBetween(startDate.toISOString(), endDate.toISOString());
    }

}