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


describe('AccountingServiceMongoImpl.hireEmployee', () => {
    let service:AccountingService;
    beforeEach( () => {
        service = new AccountingServiceMongoImpl()
    })
    afterEach( () => {
        jest.clearAllMocks()
    })
    test("Failed test: employee already exists", async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue({ id: "123" });
        await expect(service.hireEmployee({ id: "123" } as any)).rejects.toThrow("Employee id 123 already exists");
    });

    test("Passed test: new employee hired", async () => {
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null);
        (tools.checkFiredEmployees as jest.Mock).mockResolvedValue(undefined);
        const save = jest.fn();
        (EmployeeModel as any).mockImplementation(() => ({ save }));
        const result = await service.hireEmployee({ id: "new" } as any);
        expect(save).toHaveBeenCalled();
        expect(result).toHaveProperty("save");
    });
});