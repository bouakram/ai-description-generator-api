import type { Response, Request, NextFunction } from "express"
import ErrHandeling from "utils/ErrorHandler"

const globalError = (err: ErrHandeling, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        errorForDevMode(err, res)
    } else {
        errorForProdMode(err, res)
    }
}

function errorForDevMode(err: ErrHandeling, res: Response) {
    return res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack
    })
}

function errorForProdMode(err: ErrHandeling, res: Response) {
    return res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message
    })
}

export default globalError