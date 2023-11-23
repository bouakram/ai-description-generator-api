import googleAuth from '../config/passport';
import { googleAuthCallback, logIn, logOut, register } from '../controllers/authController';
import express from 'express'
const Router = express.Router()

Router.route('/google').get(googleAuth.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));
Router.route('/google/callback').get(googleAuth.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

Router.route('/register').post(register)

Router.route('/login').post(logIn)

Router.route('/logout').get(logOut)

export default Router