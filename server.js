import './loadEnv.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import route from './routes/index.js';
import notFound from './middlewares/notFoundHandler.js';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import usersService from "./services/users.js";

const app = express()

// Setup
const PORT = process.env.SERVER_PORT || 8080;

// middlewares
app.use(cors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: 'POST, GET, PUT, DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

const JwtStrategy = passportJwt.Strategy;
passport.use(new JwtStrategy({
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: cookieExtractor
}, async (payload, done) => {
    try {

        if (!payload) {
            return done(null, false);
        }

        return done(null, payload);
    } catch (error) {
        return done(error, false);
    }
}));

app.use('/v1', route);

app.use(notFound);

// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server started on port ${PORT}`)
        );
    });