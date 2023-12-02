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
import './config/passport.js';

const app = express()

// Setup
const PORT = process.env.SERVER_PORT || 8080;

// app.use(cors({
//     origin: process.env.FRONTEND_DOMAIN,
//     methods: 'POST, GET, PUT, DELETE',
//     allowedHeaders: 'Content-Type',
//     credentials: true,
// }));

const options = {
    origin: process.env.FRONTEND_DOMAIN,
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ['X-Total-Count'],
};

app.use(cors(options));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/v1', route);

app.use(notFound);

// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server started on port ${PORT}`)
        );
    });