import express, {Application, NextFunction, Request, Response} from "express";
import {authRoutes} from "./auth/auth-routes";
import {ServerEnvVariables} from "../utils/envValidator";
import {AuthUserPasswordCommandHandler} from "../domain/auth-command-handler";
import {errorHandler} from "./middleware/error-handler";
import {validateString} from "../domain/utils/validate-values";
import {ValidateSessionCommand} from "../domain/commands/auth-command";
import {AuthRequest} from "../domain/interfaces/auth-interfaces";

export const server = async (serverEnv: ServerEnvVariables, authUserPasswordCommandHandler: AuthUserPasswordCommandHandler) => {
    const app: Application = express();

    app.use(express.json());

    app.use("/auth", await authRoutes(authUserPasswordCommandHandler));

    app.use(async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const {authorization} = req.headers;
            validateString(authorization);
            const sessionToken = authorization.substr(7);

            const validateSessionCommand = new ValidateSessionCommand(sessionToken);
            const validSession = await authUserPasswordCommandHandler.handleValidSession(validateSessionCommand);
            req.session = validSession;
            res.header('X-AUTH-TOKEN', validSession.sessionToken);

            next();
        } catch (err) {
            next(err);
        }
    });


    app.get("/", (req: Request, res: Response) => {
        console.log(req.headers);
        res.status(200).json("Api Response");
      });

    app.use(errorHandler);

    try {
        app.listen(serverEnv.projectPort, (): void => {
            console.log(`Server Successfully Started.`)
        });
    } catch(err) {
        console.log(`Failed to start server ${err.message}.`);
    }
}
