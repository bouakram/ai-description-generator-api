"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorHandler_1 = __importDefault(require("./utils/ErrorHandler"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("colors");
//export routes
const openaiRoutes_1 = __importDefault(require("./routes/openaiRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
//routes
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/openai", openaiRoutes_1.default);
//handling invalid routes
app.all("*", (req, res, next) => {
    next(new ErrorHandler_1.default(`no route found ${req.originalUrl}`, 400));
});
// error middleware
app.use(errorMiddleware_1.default);
//logger
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)("dev"));
    console.log(`MODE : ${process.env.NODE_ENV}`.bgBlue);
}
//starting the server
const server = app.listen(port, () => {
    console.log(`server listening on port ${port}`.bgMagenta.white);
});
//@desc global err handeling rejection outside express
process.on("unhandledRejection", (err) => {
    if (err instanceof ErrorHandler_1.default) {
        console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
        // close the server and kill the application
        server.close(() => {
            console.error("shuting down ...");
            process.exit(1);
        });
    }
    else {
        console.error(`unhandledRejection Errors : ${err}`);
        // close the server and kill the application
        server.close(() => {
            console.error("shuting down ...");
            process.exit(1);
        });
    }
});
//# sourceMappingURL=server.js.map