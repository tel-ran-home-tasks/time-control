import configJson from '../../config/time-control-config.json' with {type: 'json'}
import dotenv from 'dotenv'


export interface AppConfig {
    port: number
    mongo_key: string
}

dotenv.config()
export const configuration: AppConfig = {
    ...configJson,
    mongo_key: process.env.MONGO_DB!
}