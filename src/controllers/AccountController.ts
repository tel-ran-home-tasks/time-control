import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {EmployeeDto} from "../model/Employee.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {configuration} from "../app-config/appConfig.js";
import {LoginData} from "../utils/timeControlTypes.js";

export class AccountController {
    private service: AccountingService = configuration.accountingService;

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

    async getFiredBetween(start: Date, end: Date) {
        const startDate = new Date(start);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(end);
        endDate.setUTCHours(23, 59, 59, 999);
        return await this.service.getFiredBetween(startDate, endDate);
    }

    async login(body: LoginData) {
        return await this.service.login(body)
    }
}