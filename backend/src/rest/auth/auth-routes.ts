import { Router, Request, Response } from "express";

export const authRoutes = async (): Promise<Router> => {
    const router = Router()

    router.use("/", (req: Request, res: Response) => {
        console.log(req);
        res.status(200).json("Auth Root");
      });

    return router;
}