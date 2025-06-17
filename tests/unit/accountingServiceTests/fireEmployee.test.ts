import {EmployeeModel, FiredEmployeeModel} from "../../../src/model/EmployeeMongo.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import * as tools from "../../../src/utils/tools.js";


jest.mock("../../../src/model/EmployeeMongo.js");
jest.mock("../../../src/utils/tools.js", () => ({
    checkFiredEmployees: jest.fn(),
    convertEmployeeToFiredEmployeeDto: jest.fn((e) => ({ ...e, fireDate: new Date() })),
    getError: (code: number, msg: string) => msg
}));

describe("AccountingServiceMongoImpl.fireEmployee", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Failed test: employee not found", async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.fireEmployee("404")).rejects.toThrow("Employee with id 404 not found");
    });

    test("Passed test: employee fired", async () => {
        const employee = { id: "emp1" };
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(employee);
        (EmployeeModel.deleteOne as jest.Mock).mockResolvedValue({});
        (tools.convertEmployeeToFiredEmployeeDto as jest.Mock).mockReturnValue({ ...employee, fireDate: new Date() });
        const save = jest.fn();
        (FiredEmployeeModel as any).mockImplementation(() => ({ save }));
        const result = await service.fireEmployee("emp1");
        expect(save).toHaveBeenCalled();
        expect(result.id).toBe("emp1");
    });
});