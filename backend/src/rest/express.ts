import express, { Application, Request, Response } from "express";

export const server = () => {
    const app: Application = express();

    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
        console.log(req);
        res.status(200).json("Api Response");
      })

    try {
        app.listen(3000, (): void => {
            console.log(`Server Successfully Started.`)
        });
    } catch(err) {
        console.log(`Failed to start server ${err.message}.`);
    }
}
