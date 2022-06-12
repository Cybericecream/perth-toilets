import {ErrorRequestHandler} from "express";

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
    console.error({
        title: `A new ${err.name || 'Error'} has been Thrown`,
        uri: req.path,
        message: err.message,
        error: err
    })
    if (res.headersSent) {
        return next(err);
    }

    switch (err.name) {
        case 'TokenExpiredError':
            return res.status(401).json({
                error: "Expired Session."
            })
        case 'NoSessionFound':
            return res.status(401).json({
                error: "Logged Out."
            })
        case 'ExistingUsername':
            return res.status(401).json({
                error: "Your Username is already in use."
            })
        case 'ExistingEmail':
            return res.status(401).json({
                error: "Your Email is already in use."
            })
        default:
            return res.status(500).json({
                error: "Internal Server Error."
            })
    }
}