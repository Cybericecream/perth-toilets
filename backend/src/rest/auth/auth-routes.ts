import {Router, Request, Response, NextFunction} from "express";
import {AuthUserPasswordCommandHandler} from "../../domain/auth-command-handler";
import {LoginCommand, LogoutCommand, SignUpCommand} from "../../domain/commands/auth-command";
import {validateString} from "../../domain/utils/validate-values";

export const authRoutes = async (authUserPasswordCommandHandler: AuthUserPasswordCommandHandler): Promise<Router> => {
    const router = Router()

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
    });

    router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {authorization} = req.headers;
            validateString(authorization);
            const sessionToken = authorization.substr(7);

            const logoutCommand = new LogoutCommand(sessionToken);
            await authUserPasswordCommandHandler.handleLogout(logoutCommand);

            return res.status(200).json('Successfully Logged Out.');
        } catch (err) {
            next(err);
        }
    });

    router.post("/sign-up", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {username, email, password, firstName, lastName} = req.body;
            validateString(username);
            validateString(email);
            validateString(password);
            validateString(firstName);
            validateString(lastName);

            const signUpCommand = new SignUpCommand({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
            }, password)
            const signUpResponse = await authUserPasswordCommandHandler.handleSignUp(signUpCommand);

            return res.status(201).json(signUpResponse);
        } catch (err) {
            next(err);
        }
    });

    return router;
}