import {NextFunction, Response, Router} from "express";
import {AuthRequest} from "../../model/auth-interfaces";
import {validateString} from "../../domain/utils/validate-values";
import {ValidateSessionCommand} from "../../domain/commands/session-command";
import {SessionCommandHandler} from "../../domain/session-command-handler";

export const userSession = async (authUserPasswordCommandHandler: SessionCommandHandler) => {
    const router = Router();

    router.use(async (req: AuthRequest, res: Response, next: NextFunction) => {
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

    return router;
}