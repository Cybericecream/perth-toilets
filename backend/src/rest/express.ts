import express, {Application, Response, Router} from "express";
import {ServerEnvVariables} from "../utils/envValidator";
import {errorHandler} from "./middleware/error-handler";
import {AuthRequest} from "../model/auth-interfaces";
import {userSession} from "./middleware/user-session";
import {SessionCommandHandler} from "../domain/session-command-handler";

type UrlString = string;
export interface Route {
    url: UrlString,
    routeHandler: Router,
}

export const server = () => {

    let server;

    const run = async (serverEnv: ServerEnvVariables, sessionCommandHandler: SessionCommandHandler, unAuthenticatedEndPoints: Route[], authenticatedEndPoints: Route[]) => {
        const app: Application = express();

        app.use(express.json());

        unAuthenticatedEndPoints.forEach((router) => {
            app.use(router.url, router.routeHandler);
        });

        app.use(await userSession(sessionCommandHandler));

        authenticatedEndPoints.forEach((router) => {
            app.use(router.url, router.routeHandler);
        });

        app.get("/", (req: AuthRequest, res: Response) => {
            console.log(req.headers);
            res.status(200).json(`Api Response ${req.session.userId}`);
        });

        app.use(errorHandler);

        try {
            server = app.listen(serverEnv.projectPort, (): void => {
                console.log(`Server Successfully Started.`)
            });
        } catch(err) {
            console.log(`Failed to start server ${err.message}.`);
        }
    }

    const stop = async () => {
        server.close(() => {
            console.log('Server Ended Successfully.');
        });
    }

    return {
        run,
        stop,
    }
}
