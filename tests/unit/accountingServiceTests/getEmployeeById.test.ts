import {AccountingServiceMongoImpl} from "../../../src/services/AccountingService/AccountingServiceMongoImpl.js";
import {AccountingService} from "../../../src/services/AccountingService/AccountingService.js";
import {EmployeeModel} from "../../../src/model/EmployeeMongo.js";


jest.mock("../../../src/model/EmployeeMongo");


describe("AccountingServiceMongoImpl.getEmployeeById", () => {
    let service: AccountingService;
    beforeEach(()=>{
        service = new AccountingServiceMongoImpl();
    });
        afterEach(()=>{
            jest.clearAllMocks();
        });
    (EmployeeModel.findOne as jest.Mock).mockResolvedValue(null)
    test('Failed test: employee not found', async () => {
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow("Employee with id UNKNOWN not found")
    })

    test('Passed test: received  employee', async () => {
        const mockEmployee = {
            firstName: "mockEmployee",
            lastName: "mockEmployee",
            id: "123",
            table_num: "Number",
            hash: "4739403892842",
            roles: ['crew']
        };
        (EmployeeModel.findOne as jest.Mock).mockResolvedValue(mockEmployee);
        const result = await service.getEmployeeById("123")
        expect(EmployeeModel.findOne).toHaveBeenCalledWith({ id: "123" });
        expect(result).toEqual(mockEmployee);
    })
})