import {Router, Request, Response, NextFunction} from "express";
import {AuthUserPasswordCommandHandler} from "../../domain/auth-command-handler";
import {LoginCommand, LogoutCommand} from "../../domain/commands/auth-command";
import {validateString} from "../../domain/utils/validate-values";
import {Hash} from "../../utils/hash";

export const authRoutes = async (authUserPasswordCommandHandler: AuthUserPasswordCommandHandler): Promise<Router> => {
    const router = Router()

    router.post("/", (req: Request, res: Response) => {
        const hash = new Hash();
        const {password} = req.body;
        res.status(200).json(hash.hashPassword(password));
      });

    router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body;
            validateString(email);
            validateString(password);

            const loginCommand = new LoginCommand(email, password);
            const loginResponse = await authUserPasswordCommandHandler.handleLogin(loginCommand);

            return res.status(200).json(loginResponse);
        } catch (err) {
            next(err);
        }
    })

    router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {sessionToken} = req.body;
            validateString(sessionToken);

            const logoutCommand = new LogoutCommand(sessionToken);
            await authUserPasswordCommandHandler.handleLogout(logoutCommand);

            return res.status(200).json('Successfully Logged Out.');
        } catch (err) {
            next(err);
        }
    })

    return router;
}