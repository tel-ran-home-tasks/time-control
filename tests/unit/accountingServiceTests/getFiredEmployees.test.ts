import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {FiredEmployeeModel} from "../../../src/model/EmployeeMongo.js";

jest.mock("../../../src/model/EmployeeMongo.js");
describe("AccountingServiceMongoImpl.getFiredEmployees", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Passed test: return fired employees", async () => {
        const fired = [{ id: "f1" }];
        (FiredEmployeeModel.find as jest.Mock).mockReturnValue({ lean: () => Promise.resolve(fired) });
        const result = await service.getFiredEmployees();
        expect(result).toEqual(fired);
    });
});