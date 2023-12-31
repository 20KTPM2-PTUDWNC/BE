import * as express from 'express';
import * as authController from '../controllers/auth.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';
import jwt from "jsonwebtoken";

const authRoute = express.Router();

authRoute.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, profile) => {
            req.user = profile;
            next();
        })(req, res, next)
    }, (req, res) => {
        const accessToken = jwt.sign(JSON.stringify(req.user), process.env.SECRET_KEY);
        res.redirect(`${process.env.FRONTEND_DOMAIN}/#/loginSuccess/${accessToken}`)
    }
);

authRoute.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRoute.get('/auth/facebook/callback',
    (req, res, next) => {
        passport.authenticate('facebook', (err, profile) => {
            req.user = profile;
            next();
        })(req, res, next)
    }, (req, res) => {
        const accessToken = jwt.sign(JSON.stringify(req.user), process.env.SECRET_KEY);
        res.redirect(`${process.env.FRONTEND_DOMAIN}/#/loginSuccess/${accessToken}`)
    });

authRoute.get('/auth/facebook',
    passport.authenticate('facebook',  { scope: ['email'], session: false }));

authRoute.get('/signInSuccess', nextWrapper(authController.signInSuccess));

authRoute.post('/signUp', nextWrapper(authController.signUp));

authRoute.post('/signIn', nextWrapper(authController.signIn));

authRoute.get('/signOut', nextWrapper(authController.signOut));

authRoute.get('/activateAccount/:token', nextWrapper(authController.activateAccount));

authRoute.post('/forgotPassword', nextWrapper(authController.forgotPassword));

authRoute.post('/resetPassword', nextWrapper(authController.resetPassword));

export default authRoute;