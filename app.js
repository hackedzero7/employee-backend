const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const ErrorMiddleware = require('./middlewares/Error');
const employee = require('./routes/employee');
const leave = require('./routes/leave');
const schedule = require('./routes/schedule');
const clockinDetails = require('./routes/clockinDetails');
const cors = require('cors');
const app = express();

dotenv.config({
    path: "./configuration/config.env"
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"]
}))


app.use('/api/v1', employee);
app.use('/api/v1', leave);
app.use('/api/v1', schedule);
app.use('/api/v1', clockinDetails);
module.exports = app;

app.use(ErrorMiddleware)