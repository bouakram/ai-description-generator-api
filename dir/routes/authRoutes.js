"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("../config/passport"));
const authController_1 = require("../controllers/authController");
const express_1 = __importDefault(require("express"));
const Router = express_1.default.Router();
Router.route('/google').get(passport_1.default.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));
Router.route('/google/callback').get(passport_1.default.authenticate('google', { failureRedirect: '/login' }), authController_1.googleAuthCallback);
Router.route('/register').post(authController_1.register);
Router.route('/login').post(authController_1.logIn);
Router.route('/logout').post(authController_1.logOut);
exports.default = Router;
//# sourceMappingURL=authRoutes.js.map