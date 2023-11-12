import './loadEnv.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import route from './routes/index.js';
import notFound from './middlewares/notFoundHandler.js';

const app = express()

// Setup
const PORT = process.env.SERVER_PORT || 8080;

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/v1', route);

app.use(notFound);

// Connect to database
connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server started on port ${PORT}`)
        );
    });