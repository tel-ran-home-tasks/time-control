import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongo.js";

jest.mock("../../../src/model/EmployeeMongo.js");

describe("AccountingServiceMongoImpl.setRole", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Failed test: employee not found", async () => {
        (EmployeeModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
        await expect(service.setRole("404", "admin")).rejects.toThrow("Employee with id 404 not found");
    });

    test("Passed test: role updated", async () => {
        const updated = { id: "1", roles: ["admin"] };
        (EmployeeModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updated);
        const result = await service.setRole("1", "admin");
        expect(result).toEqual(updated);
    });
});
