import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import Web3 from "web3";

import authRouter from './routes/auth'
import homeRouter from './routes/home'
import appointmentRouter from './routes/appointment'
import healthRecordRouter from './routes/healthRecord'

const app = express();
const PORT = process.env.PORT || 3600;
const HOST = process.env.HOST || "localhost";
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'database';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || 'root';
const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));

console.log(DB_NAME)
app.use(express.json());

app.use('/auth', authRouter);
app.use('/homepage', homeRouter);
app.use('/appointment', appointmentRouter);
app.use('/health_record', healthRecordRouter);

web3.eth.net.isListening()
    .then(() => console.log('connected to ethereum node at '+ ganacheServer))
    .catch(e => console.log('unable to connect to ethereum node at '+ ganacheServer + ' \n'+ e));

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
).then(() => {
        console.log("Connection Successful");
    }).catch((e) => {
        console.log(e);
    });

app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}/`);
});

module.exports = app;