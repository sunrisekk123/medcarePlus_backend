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
const healthRecordContractAddress = "0xC0e71912a00D25508fc1616C9ddf3Bec5a618c9a";
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
        // return web3.eth.accounts.privateKeyToAccount("0x4bf149af2a5ce143fa39474e29891de9ed7baa38e0ebe86e0808eb60947279cf");
        // return web3.eth.accounts.privateKeyToAccount("0xac126f348a15f06c623f74a8669259f90f89dede04426f1739add710278cbd36");
         return web3.eth.accounts.privateKeyToAccount("0x28c729be9af5de2a2557ae9b68df102fd5994c7caf7cf8ef87f82df4e61af28d");
    }

    async createWalletClinic(){
        return web3.eth.accounts.privateKeyToAccount("0x8fd6aa55e445ce5e88b915f7fdeca23d89bfbf1458d36917232ca01fc7766ebd");
    }

    async encryptPrivateKey(pKeys){
        const keySign = crypto.randomBytes(32);
        const ivSign = crypto.randomBytes(16);

        const cipherSign = crypto.createCipheriv('aes-256-cbc', keySign, ivSign);
        const encryptedSign1 = cipherSign.update(pKeys, "utf-8", "hex");
        const encryptedSign2 = encryptedSign1 + cipherSign.final("hex");

        return JSON.stringify({encryptedSign: encryptedSign2, iSign: ivSign.toString('hex'), kSign: keySign.toString('hex')});
    }

    async decryptPrivateKey(dbKey){
        const dbData = JSON.parse(dbKey);
        const ivS =  Buffer.from(dbData.iSign, 'hex');
        const keyS = Buffer.from(dbData.kSign, 'hex');
        const encryptedSignature = dbData.encryptedSign;

        const decipherS = crypto.createDecipheriv('aes-256-cbc', keyS, ivS);

        const signature1 = decipherS.update(encryptedSignature, "hex", "utf-8");
        return signature1 + decipherS.final("utf8");
    }

    async pinProcessing(walletAddress, pin){
        return await bcryptjs.hashSync(pin);
    }


}