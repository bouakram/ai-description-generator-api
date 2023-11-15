// import type { Response, Request } from "express"

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    if (process.env.NODE_ENV === "development") {
        errorForDevMode(err, res)
    } else {
        errorForProdMode(err, res)
    }
}

function errorForDevMode(err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack
    })
}

function errorForProdMode(err, res) {
    return res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message
    })
}

module.exports = globalError