import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongo.js";

jest.mock("../../../src/model/EmployeeMongo.js");

describe("AccountingServiceMongoImpl.updateEmployee", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Failed test: not found", async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.updateEmployee("404", {} as any)).rejects.toThrow("Employee with id 404 not found");
    });

    test("Passed test: employee updated", async () => {
        const emp = { id: "1", save: jest.fn() };
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(emp);
        const result = await service.updateEmployee("1", {
            id: "1",
            password: "placeholder",
            firstName: "A",
            lastName: "B"
        });
        expect(emp.save).toHaveBeenCalled();
        expect(result).toBe(emp);
    });
});