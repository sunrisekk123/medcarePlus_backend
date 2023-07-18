import User from "../models/user";
import Clinic from "../models/clinic";
import crypto from "crypto";
import dotenv from 'dotenv';
import Web3 from "web3";
import bcryptjs from "bcryptjs";
dotenv.config();
const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));

const healthRecordContractPath = require("../build/contracts/HealthRecord.json");
const healthRecordContractABI = healthRecordContractPath["abi"];
const healthRecordContractAddress = "0x642667A5f0E5503AdD249F25745954D9558e9383";
const healthRecordContract = new web3.eth.Contract(healthRecordContractABI, healthRecordContractAddress);

export default class AuthService {

    async getUserInfoSingle(email){
        return User.findOne({EMAIL: email});
    }

    async addUserInfo(userDoc){
        return await User.create(userDoc);
    }

    async addClinicInfo(clinicDoc){
        return await Clinic.create(clinicDoc);
    }

    async getClinicInfoSingle(email){
        return User.findOne({EMAIL: email});
    }

    async createWallet(){
        return web3.eth.accounts.privateKeyToAccount("0x32118c149a17807b24eca0986441d591f8368e4835f791b8f64c5165328bb692");
    }

    async encryptPrivateKey(pKeys){
        const dataAfterSign = web3.eth.accounts.sign(pKeys, pKeys);
        const keySign = crypto.randomBytes(32);
        const ivSign = crypto.randomBytes(16);
        const cipherSign = crypto.createCipheriv('aes-256-cbc', Buffer.from(keySign), ivSign);
        const encryptedSign = Buffer.concat([cipherSign.update(dataAfterSign.signature), cipherSign.final()]);

        const keyHash = crypto.randomBytes(32);
        const ivHash = crypto.randomBytes(16);
        const cipherHash = crypto.createCipheriv('aes-256-cbc', Buffer.from(keyHash), ivHash);
        const encryptedHashMsg = Buffer.concat([cipherHash.update(dataAfterSign.messageHash), cipherHash.final()]);
        return JSON.stringify({encryptedSign: encryptedSign.toString('hex'), ivSign: ivSign.toString('hex'), keySign: keySign.toString('hex'), encryptedHash: encryptedHashMsg.toString('hex'), ivHash: ivHash.toString('hex'), keyHash:keyHash.toString('hex')});
    }

    async decryptPrivateKey(dbKey){
        const dbData = JSON.parse(dbKey);

        const ivS =  Buffer.from(dbData.ivSign, 'hex');
        const keyS = Buffer.from(dbData.keySign, 'hex');
        const ivH =  Buffer.from(dbData.ivHash, 'hex');
        const keyH = Buffer.from(dbData.keyHash, 'hex');
        const encryptedSignature = Buffer.from(dbData.encryptedSign, 'hex');
        const encryptedHashMsg = Buffer.from(dbData.encryptedHash, 'hex');

        const decipherS = crypto.createDecipheriv('aes-256-cbc', Buffer.from(keyS), ivS);
        const decipherH = crypto.createDecipheriv('aes-256-cbc', Buffer.from(keyH), ivH);

        const signature = Buffer.concat([decipherS.update(encryptedSignature), decipherS.final()]);
        const hashedMsg = Buffer.concat([decipherH.update(encryptedHashMsg), decipherH.final()]);

        const v = "0x"+signature.toString().substring(130,133);
        const r = "0x"+signature.toString().substring(2,66);
        const s = "0x"+signature.toString().substring(66,130);
        return await web3.eth.accounts.recover({
            messageHash: hashedMsg.toString(),
            v: v,
            r: r,
            s: s
        });
    }

    async pinProcessing(walletAddress, pin){
        return await bcryptjs.hashSync(pin);
    }


}