import express from 'express'
import authRouter from './routes/auth'
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3600;
const HOST = process.env.HOST || "localhost";
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'database';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || 'root';
console.log(DB_NAME)
app.use(express.json());

app.use('/auth', authRouter);



mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    // , {dbName: DB_NAME, user:DB_USER, pass:DB_PASS}
).then(() => {
        console.log("Connection Successful");
    }).catch((e) => {
        console.log(e);
    });

app.listen(PORT, HOST, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;