import express from 'express';
import {configuration} from "./app-config/appConfig.js";
import * as mongoose from "mongoose";
import {accountRouter} from "./routers/accountRouter.js";
import {validateBody} from "./middleware/validation.js";
import {joiSchemas} from "./utils/joiSchemas.js";
import {errorHandler} from "./errorHandler/errorHandler.js";


export const launchServer = () => {
    const app = express();
    app.listen(configuration.port, () => {
        console.log(`Server runs at port ${configuration.port}`)
    })
//====================MongoDB==================
    mongoose.connect(configuration.mongo_key).then(() => console.log("Server connect to MongoDb"))
        .catch(err => console.log(err.message))
//====================Middleware===============
    app.use(express.json())
    // app.use(validateBody(joiSchemas))
//====================Routing==================
    app.use('/accounts', accountRouter)
//====================errorHandling============
    app.use(errorHandler)
}