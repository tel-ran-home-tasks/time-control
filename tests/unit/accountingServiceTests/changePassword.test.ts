import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import bcrypt from "bcrypt";
import {EmployeeModel} from "../../../src/model/EmployeeMongo.js";

jest.mock("../../../src/model/EmployeeMongo.js");
jest.mock("bcrypt");
describe("AccountingServiceMongoImpl.changePassword", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Failed test: employee not found", async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue("hash");
        (EmployeeModel.updateOne as jest.Mock).mockResolvedValue({ matchedCount: 0 });
        await expect(service.changePassword("1", "newpass")).rejects.toThrow("Employee with id 1 not found");
    });

    test("Passed test: password changed", async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue("hash");
        (EmployeeModel.updateOne as jest.Mock).mockResolvedValue({ matchedCount: 1 });
        await service.changePassword("1", "newpass");
        expect(EmployeeModel.updateOne).toHaveBeenCalledWith({ id: "1" }, { $set: { password: "hash" } });
    });
});