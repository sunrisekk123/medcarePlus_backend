import dotenv from 'dotenv';
import Web3 from "web3";
import Clinic from "../models/clinic";
dotenv.config();

const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const appointmentContract = require("../build/contracts/Appointment.json");
const contractABI = appointmentContract["abi"];
const contractAddress = "0x17C5A62b095ADC4ABa4F3143adFbB0F8dB8079FC";
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));
const contract = new web3.eth.Contract(contractABI, contractAddress);
import UserModel from "../models/user";

export default class AppointmentService {

    async addAppointment(walletAddress, clinicAddress, doctor, date, time, status){
        const appointmentId = walletAddress+clinicAddress+date+time;
        console.log(appointmentId);
        console.log(walletAddress);
        console.log(clinicAddress);
        console.log(doctor);
        console.log(date);
        console.log(time);
        console.log(status);
        const result = await contract.methods.insertAppointment(appointmentId, walletAddress, clinicAddress, doctor, date, time, web3.utils.asciiToHex(status.toString())).send({from: walletAddress.toString(), gas: "6721975"});
        console.log(result)
        return true;
    }

    async getAppointment(appointmentId){
        const result = await contract.methods.getAppointment(appointmentId.toString()).call();
        console.log(result)
        return result;
    }

    async getAppointmentByNewEventUsingUserAddress(address){
        return await contract.getPastEvents('LogNewAppointment', {
            filter: {userAddress: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            console.log(events[0].returnValues)
            return events;
        });
    }

    async getAppointmentByUpdateEventUsingUserAddress(address){
        return await contract.getPastEvents('LogUpdateAppointment', {
            filter: {userAddress: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            console.log(events[0].returnValues)
            return events;
        });
    }

    async getAppointmentClinicInfo(cAddress){
        return Clinic.find({WALLET_ADDRESS: cAddress});
    }

    async getAppointmentUserInfo(cAddress){
        return UserModel.find({WALLET_ADDRESS: cAddress});
    }

    async getAppointmentByNewEventUsingClinicAddress(address){
        return await contract.getPastEvents('LogNewAppointment', {
            filter: {clinicAddress: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            console.log(events[0].returnValues)
            return events;
        });
    }

    async getAppointmentByUpdateEventUsingClinicAddress(address){
        return await contract.getPastEvents('LogUpdateAppointment', {
            filter: {clinicAddress: address},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            console.log(events[0].returnValues)
            return events;
        });
    }

    async updateAppointmentStatus(id, address, accountType, status){
        return await contract.methods.updateAppointmentStatus(id, web3.utils.asciiToHex(status.toString())).send({from: address.toString(), gas: "6721975"});
    }
}