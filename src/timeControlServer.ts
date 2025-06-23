import express from 'express';
import {configuration} from "./app-config/appConfig.js";
import * as mongoose from "mongoose";
import {accountRouter} from "./routers/accountRouter.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import morgan from "morgan";
import fs from 'fs';
import {shiftRouter} from "./routers/shiftRouter.js";
import {authorize} from "./middleware/authorize.js";
import swaggerUi from 'swagger-ui-express';
import * as SwaggerDoc from '../docs/openapi.json' with {type:'json'}


export const launchServer = () => {
    const app = express();
    //=================Mongo Connection===================
    mongoose.connect(configuration.mongo_key).then(() => console.log("Server connected with Mongo"))
        .catch((err: any) => console.log(err))
    const logStream = fs.createWriteStream('./src/access.log', {flags: "a"})
    //===============Server run===========================
    app.listen(configuration.port, () => {
        console.log(`server starts at http://localhost:${configuration.port}`)
    })
    //=============Middleware=============================
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}));


    //================Security==================
    app.use(express.json());
    app.use(authenticate(configuration.accountingService));
    app.use(skipRoutes(configuration.skipPaths));
    app.use(authorize(configuration.pathsRoles, configuration.skipPaths))
    //=====================Swagger Docs===================
    app.use('/docs',swaggerUi.serve,swaggerUi.setup(SwaggerDoc))
    //===============Routing==============================
    app.use('/accounts', accountRouter)
    app.use('/shifts', shiftRouter)
    //==============ErrorHandler===================
    app.use(errorHandler);
}