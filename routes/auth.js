import * as express from 'express';
import * as authController from '../controllers/auth.js';
import nextWrapper from '../middlewares/nextWrapper.js';
import passport from 'passport';

const authRoute = express.Router();

authRoute.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, profile) => {
            req.user = profile;
            next();
        })(req, res, next)
    }, (req, res) => {
        res.redirect(`${process.env.FRONTEND_DOMAIN}/#/loginSuccess/${req.user?.id}`)
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
        res.redirect(`${process.env.FRONTEND_DOMAIN}/#/loginSuccess/${req.user?.id}`)
    });

authRoute.get('/auth/facebook',
    passport.authenticate('facebook',  { scope: ['email'], session: false }));

authRoute.get('/signInSuccess', nextWrapper(authController.signInSuccess));

authRoute.post('/signUp', nextWrapper(authController.signUp));

authRoute.post('/signIn', nextWrapper(authController.signIn));

authRoute.get('/signOut', nextWrapper(authController.signOut));

authRoute.get('/activateAccount/:token', nextWrapper(authController.activateAccount));

export default authRoute;