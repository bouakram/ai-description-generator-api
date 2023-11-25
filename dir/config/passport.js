"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const prismaClient_1 = require("../utils/prismaClient");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const generateToken_1 = __importDefault(require("../token/generateToken"));
const URL = process.env.API_URL === 'http://localhost:' ? process.env.API_URL + process.env.PORT : process.env.API_URL;
let GoogleStrategy = passport_google_oauth20_1.default.Strategy;
//@desc login / regester user using google
//@route /api/v1/auth/google-auth
//@access public
const googleAuth = passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}/api/v1/auth/google/callback`,
}, async function (accessToken, refreshToken, profile, cb) {
    // console.log("profile")
    // console.log(profile)
    //create user in the db if not exist in the db else update it
    const user = await prismaClient_1.prisma.user.findUnique({
        where: {
            googleId: profile.id
        }
    });
    if (!user) {
        const CREATED_USER = await prismaClient_1.prisma.user.create({
            data: {
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                pic: profile.photos[0].value,
                accessToken: accessToken,
            }
        });
        (0, generateToken_1.default)(CREATED_USER.id);
        return cb(null, profile);
    }
    else {
        const UPDATED_USER = await prismaClient_1.prisma.user.update({
            where: {
                googleId: profile.id
            },
            data: {
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                pic: profile.photos[0].value,
                accessToken: accessToken,
            }
        });
        (0, generateToken_1.default)(UPDATED_USER.id);
        return cb(null, profile);
    }
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    const USER = prismaClient_1.prisma.user.findUnique({ where: { googleId: id } });
    if (USER) {
        process.nextTick(function (err, USER) {
            done(err, USER);
        });
    }
});
exports.default = googleAuth;
//# sourceMappingURL=passport.js.map