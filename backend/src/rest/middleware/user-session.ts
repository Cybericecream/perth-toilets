import {NextFunction, Response, Router} from "express";
import {AuthRequest} from "../../domain/interfaces/auth-interfaces";
import {validateString} from "../../domain/utils/validate-values";
import {ValidateSessionCommand} from "../../domain/commands/auth-command";
import {AuthUserPasswordCommandHandler} from "../../domain/auth-command-handler";

export const userSession = async (authUserPasswordCommandHandler: AuthUserPasswordCommandHandler) => {
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