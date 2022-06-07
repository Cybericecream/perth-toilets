import express, { Application, Request, Response } from "express";
import {authRoutes} from "./auth/auth-routes";
import {ServerEnvVariables} from "../utils/envValidator";
import {AuthUserPasswordCommandHandler} from "../domain/auth-command-handler";

export const server = async (serverEnv: ServerEnvVariables, authUserPasswordCommandHandler: AuthUserPasswordCommandHandler) => {
    const app: Application = express();

    app.use(express.json());

    app.use("/auth", await authRoutes(authUserPasswordCommandHandler))

    app.get("/", (req: Request, res: Response) => {
        console.log(req);
        res.status(200).json("Api Response");
      })

    try {
        app.listen(serverEnv.projectPort, (): void => {
            console.log(`Server Successfully Started.`)
        });
    } catch(err) {
        console.log(`Failed to start server ${err.message}.`);
    }
}
