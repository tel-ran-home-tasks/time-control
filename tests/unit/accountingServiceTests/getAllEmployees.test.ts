import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongo.js";
import * as tools from "../../../src/utils/tools.js";

jest.mock("../../../src/model/EmployeeMongo.js");
jest.mock("../../../src/utils/tools.js", () => ({
    checkFiredEmployees: jest.fn(),
    convertEmployeeToFiredEmployeeDto: jest.fn((e) => ({ ...e, fireDate: new Date() })),
    getError: (code: number, msg: string) => msg
}));

describe("AccountingServiceMongoImpl.getAllEmployees", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Passed test: get all employees", async () => {
        const employees = [{ id: "1" }];
        (EmployeeModel.find as jest.Mock).mockResolvedValue(employees);
        (tools.convertEmployeeToFiredEmployeeDto as jest.Mock).mockImplementation((e) => ({ ...e, fireDate: new Date() }));
        const result = await service.getAllEmployees();
        expect(result).toHaveLength(1);
    });
});
