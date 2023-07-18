import User from "../models/user";
import ClinicDoctor from "../models/clinicDoctor"
import QRCode from "qrcode";
import Clinic from "../models/clinic"
import AppointmentDiagnosis from "../models/appointmentDiagnosis"
import dotenv from 'dotenv';
import Web3 from "web3";
import crypto from "crypto";

dotenv.config();
const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));

const healthRecordContractPath = require("../build/contracts/HealthRecord.json");
const healthRecordContractABI = healthRecordContractPath["abi"];
const healthRecordContractAddress = "0x642667A5f0E5503AdD249F25745954D9558e9383";
const healthRecordContract = new web3.eth.Contract(healthRecordContractABI, healthRecordContractAddress);
export default class HealthRecordService {
    async getQrCode(email){
        const user = await User.findOne({EMAIL: email});
        if(user){
            return QRCode.toDataURL(user._doc.WALLET_ADDRESS);
        }
    }

    async addTrustHealthProvider(userAddress, clinicAddress){
        const today = new Date();
        const month = today.getMonth().toString().length === 2? today.getMonth().toString(): "0"+ today.getMonth().toString();
        const date = today.getDate().toString().length === 2? today.getDate().toString(): "0"+ today.getDate().toString();
        const todayDate = today.getFullYear().toString()+month+date;
        const hours = today.getHours().toString().length === 2? today.getHours().toString(): "0"+ today.getHours().toString();
        const min = today.getMinutes().toString().length === 2? today.getMinutes().toString(): "0"+ today.getMinutes().toString();
        const nowTime = hours+min;

        return healthRecordContract.methods.insertHealthProvider(userAddress, clinicAddress, todayDate, nowTime, web3.utils.asciiToHex("A")).send({
            from: clinicAddress.toString(),
            gas: "6721975"
        });
    }

    async checkUserAddressValid(userAddress){
        const result = await User.find({WALLET_ADDRESS: userAddress});

        return (result.length > 0)
    }


    async getClinicByEmail(email){
        return Clinic.aggregate([
            {
                $match:{EMAIL:email}
            },
            {
            $lookup:{
                from: "MAS_CLINIC_DOCTOR_INFO",
                localField: "_id",
                foreignField: "CLINIC_ID",
                as: "DOCTOR_INFO"
            }
        }]);
    }

    async getUserByWalletAddress(address){
        return User.find({WALLET_ADDRESS: address});
    }


    async getDoctorIdByName(name){
        const result = await ClinicDoctor.find({NAME: name});
        return result[0]._id;
    }

    async addHealthRecordToContract(appointmentId, clinicWalletAddress, userWalletAddress, doctor, recordStr, remarks){
        const today = new Date();
        const month = today.getMonth().toString().length === 2? today.getMonth().toString(): "0"+ today.getMonth().toString();
        const date = today.getDate().toString().length === 2? today.getDate().toString(): "0"+ today.getDate().toString();
        const todayDate = today.getFullYear().toString()+month+date;
        const hours = today.getHours().toString().length === 2? today.getHours().toString(): "0"+ today.getHours().toString();
        const min = today.getMinutes().toString().length === 2? today.getMinutes().toString(): "0"+ today.getMinutes().toString();
        const nowTime = hours+min;
        const nowDateTime = todayDate+nowTime;

        return healthRecordContract.methods.insertHealthRecord(
            userWalletAddress.toString(), clinicWalletAddress.toString(), appointmentId.toString(), doctor.toString(), nowDateTime.toString(), recordStr.toString(), remarks.toString()
        ).send({from: clinicWalletAddress.toString(), gas: "6721975"});
    }

    async addHealthRecordToAppointment(appointmentId, clinicWalletAddress, userWalletAddress, doctorId, recordStr, remarks){
        const today = new Date();
        const month = today.getMonth().toString().length === 2? today.getMonth().toString(): "0"+ today.getMonth().toString();
        const date = today.getDate().toString().length === 2? today.getDate().toString(): "0"+ today.getDate().toString();
        const todayDate = today.getFullYear().toString()+month+date;
        const hours = today.getHours().toString().length === 2? today.getHours().toString(): "0"+ today.getHours().toString();
        const min = today.getMinutes().toString().length === 2? today.getMinutes().toString(): "0"+ today.getMinutes().toString();
        const nowTime = hours+min;

        let appointmentDiaDoc = new AppointmentDiagnosis({
            _id: appointmentId,
            CLINIC_WALLET_ADDRESS: clinicWalletAddress,
            USER_WALLET_ADDRESS: userWalletAddress,
            DOCTOR_ID: doctorId,
            DATE: todayDate,
            TIME: nowTime,
            RECORDS: recordStr,
            REMARKS: remarks
        });

        return await AppointmentDiagnosis.create(appointmentDiaDoc);
    }

    async  getHealthRecordFromContractByUser(address){
        return await healthRecordContract.getPastEvents('LogNewHealthRecord', {
            filter: {userAddress: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            console.log(events[0].returnValues)
            return events;
        });
    }



}