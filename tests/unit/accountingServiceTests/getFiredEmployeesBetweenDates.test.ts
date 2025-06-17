import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {FiredEmployeeModel} from "../../../src/model/EmployeeMongo.js";

jest.mock("../../../src/model/EmployeeMongo.js");
describe("AccountingServiceMongoImpl.getFiredBetween", () => {
    let service: AccountingService;
    beforeEach(() => {
        service = new AccountingServiceMongoImpl();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Passed test: get employees between dates", async () => {
        const data = [{ id: "1" }];
        (FiredEmployeeModel.find as jest.Mock).mockResolvedValue(data);
        const result = await service.getFiredBetween("2024-01-01", "2024-06-01");
        expect(FiredEmployeeModel.find).toHaveBeenCalledWith({
            fireDate: {
                $gte: "2024-01-01",
                $lte: "2024-06-01"
            }
        });
        expect(result).toEqual(data);
    });
});