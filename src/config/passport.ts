import passport from "passport"
import passportGoogle from 'passport-google-oauth20'
import { prisma } from '../utils/prismaClient'
import { config } from 'dotenv'
config()
import { User } from "@prisma/client"
import generateToken from "../token/generateToken"

const URL: string = process.env.API_URL === 'http://localhost:' ? process.env.API_URL + process.env.PORT : process.env.API_URL


let GoogleStrategy = passportGoogle.Strategy

//@desc login / regester user using google
//@route /api/v1/auth/google-auth
//@access public
const googleAuth = passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${URL}/api/v1/auth/google/callback`,
},
    async function (accessToken, refreshToken, profile, cb) {
        // console.log("profile")
        // console.log(profile)
        //create user in the db if not exist in the db else update it
        const user: User = await prisma.user.findUnique({
            where: {
                googleId: profile.id
            }
        })
        if (!user) {
            const CREATED_USER = await prisma.user.create({
                data: {
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    pic: profile.photos[0].value,
                    accessToken: accessToken,
                }
            })
            generateToken(CREATED_USER.id)
            return cb(null, profile);
        } else {
            const UPDATED_USER = await prisma.user.update({
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
            })
            generateToken(UPDATED_USER.id)
            return cb(null, profile);
        }
    }
));

passport.serializeUser(function (user: passportGoogle.Profile, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id: string, done) {
    const USER = prisma.user.findUnique({ where: { googleId: id } })
    if (USER) {
        process.nextTick(function (err: Error, USER: passportGoogle.Profile) {
            done(err, USER);
        })
    }
});

export default googleAuth