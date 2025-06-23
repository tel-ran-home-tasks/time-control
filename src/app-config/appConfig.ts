import configJson from '../../config/time-control-config.json' with {type: 'json'}
import dotenv from 'dotenv'
import {AccountingService} from "../services/AccountingService/AccountingService.js";
import {AccountingServiceMongoImpl} from "../services/AccountingService/AccountingServiceMongoImpl.js";
import {Role} from "../utils/timeControlTypes.js";


export interface AppConfig {
    port: number,
    skipPaths: string[],
    mongo_key: string
    jwt: {
        secret: string,
        exp_time: string | number
    },
    accountingService: AccountingService,
    pathsRoles: Record<string, Role[]>
}

dotenv.config()
export const configuration: AppConfig = {
    ...configJson,
    mongo_key: process.env.MONGO_DB!,
    jwt: {
        secret: process.env.SECRET_JWT!,
        exp_time: 600
    },
    accountingService: new AccountingServiceMongoImpl(),
    pathsRoles: {
        "POST/accounts": [Role.HR, Role.SUP],
        "PUT/accounts/:param": [Role.HR, Role.SUP],
        "PATCH/accounts/:param/password": [Role.HR, Role.SUP],
        "PATCH/accounts/:param/role": [Role.SUP],
        "GET/accounts": [Role.MNG, Role.SUP],
        "GET/accounts/:param": [Role.MNG, Role.SUP],
        "GET/accounts/fired/range": [Role.HR, Role.SUP],
        "GET/accounts/fired": [Role.HR, Role.SUP],
        "POST/accounts/login": [Role.HR, Role.SUP, Role.CREW],
        "DELETE/accounts/:param": [Role.HR, Role.SUP],
        "POST/shifts/start": [Role.CREW],
        "PATCH/shifts/end": [Role.CREW],
        "PATCH/shifts/break/start/:paramm": [Role.CREW],
        "PATCH/shifts/break/start/30m": [Role.CREW],
        "PATCH/shifts/break/end": [Role.CREW],
        "GET/shifts/summary": [Role.SUP,Role.CREW],
        "GET/shifts/export/csv": [Role.SUP]
    },
}

