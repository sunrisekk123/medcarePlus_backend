import AppointmentService from "../services/appointmentService";
const appointmentServices = new AppointmentService();
import dotenv from 'dotenv';
import Web3 from "web3";
dotenv.config();
const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));

export async function handleInsertAppointment(req, res, next) {
    try {
        const {user, clinic, doctor, date, time, status} = req.body;
        const clinicList = await appointmentServices.addAppointment(user, clinic, doctor, date, time, status);
        if (!clinicList) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleUpdateAppointmentStatus(req, res, next) {
    try {
        const {id, address, accountType, status} = req.body;
        console.log(id)
        console.log(address)
        const isSuccess = await appointmentServices.updateAppointmentStatus(id, address, accountType, status);
        if (!isSuccess) {
            return res.status(400).json({ msg: "Fail" });
        }

        res.json(isSuccess);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleGetAppointmentUsingId(req, res, next) {
    try {
        const appointmentId = "0x39571Ae07158b049031a40c38C4fde9B6a62C52F0x2dd6F8d23fDfeB73fDd0dA57556301F4d71d90802023-07-14";
        const result = await appointmentServices.getAppointment(appointmentId);
        res.json({data: [result.toString()]});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleGetAppointmentUsingUserAddress(req, res, next) {
    try {
        const userAddress = req.params.wallet_address;
        const newAppointmentEvent = await appointmentServices.getAppointmentByNewEventUsingUserAddress(userAddress);
        const updateAppointmentEvent = await appointmentServices.getAppointmentByUpdateEventUsingUserAddress(userAddress);
        let resultList = [];
        let updateLogReturnList = [];
        const user = await appointmentServices.getAppointmentUserInfo(userAddress);
        if(updateAppointmentEvent.length>0){
            updateAppointmentEvent.forEach((e)=>{
                updateLogReturnList.push({
                    appointmentId: e.returnValues["appointmentId"],
                    userAddress: e.returnValues["userAddress"],
                    clinicAddress: e.returnValues["clinicAddress"],
                    index: e.returnValues["index"].toString(),
                    doctor: e.returnValues["doctor"],
                    date: e.returnValues["date"],
                    time: e.returnValues["time"],
                    status: web3.utils.hexToAscii(e.returnValues["status"]),

                })
            })
        }
        if(newAppointmentEvent.length>0){
            for (const e of newAppointmentEvent) {
                const clinic = await appointmentServices.getAppointmentClinicInfo(e.returnValues["clinicAddress"]);
                if(updateLogReturnList.length > 0){
                    const findInUpdateLog = updateLogReturnList.findLast((update)=> e["appointmentId"] === update["appointmentId"]);
                    if(findInUpdateLog.length>0){
                        resultList.push({
                            appointmentId: findInUpdateLog.returnValues["appointmentId"],
                            userAddress: findInUpdateLog.returnValues["userAddress"],
                            userFName: user[0]["FNAME"],
                            userLName: user[0]["LNAME"],
                            userEmail: user[0]["EMAIL"],
                            userHKID: user[0]["HKID_NO"],
                            userPhone: user[0]["PHONE_NO"],
                            userHomeAddress: user[0]["ADDRESS"],
                            userBirthDate: user[0]["BIRTH_DATE"],
                            clinicAddress: findInUpdateLog.returnValues["clinicAddress"],
                            clinicName: clinic[0]["NAME"],
                            clinicLocation: clinic[0]["ADDRESS"],
                            clinicDistrict: clinic[0]["DISTRICT"],
                            clinicArea: clinic[0]["AREA"],
                            clinicImage: clinic[0]["IMAGE_PATH"],
                            index: findInUpdateLog.returnValues["index"].toString(),
                            doctor: findInUpdateLog.returnValues["doctor"],
                            date: findInUpdateLog.returnValues["date"],
                            time: findInUpdateLog.returnValues["time"],
                            status: web3.utils.hexToAscii(findInUpdateLog.returnValues["status"]),
                        })
                    }else {
                        resultList.push({
                            appointmentId: e.returnValues["appointmentId"],
                            userAddress: e.returnValues["userAddress"],
                            userFName: user[0]["FNAME"],
                            userLName: user[0]["LNAME"],
                            userEmail: user[0]["EMAIL"],
                            userHKID: user[0]["HKID_NO"],
                            userPhone: user[0]["PHONE_NO"],
                            userHomeAddress: user[0]["ADDRESS"],
                            userBirthDate: user[0]["BIRTH_DATE"],
                            clinicAddress: e.returnValues["clinicAddress"],
                            clinicName: clinic[0]["NAME"],
                            clinicLocation: clinic[0]["ADDRESS"],
                            clinicDistrict: clinic[0]["DISTRICT"],
                            clinicArea: clinic[0]["AREA"],
                            clinicImage: clinic[0]["IMAGE_PATH"],
                            index: e.returnValues["index"].toString(),
                            doctor: e.returnValues["doctor"],
                            date: e.returnValues["date"],
                            time: e.returnValues["time"],
                            status: web3.utils.hexToAscii(e.returnValues["status"]),
                        })
                    }
                }else{
                    resultList.push({
                        appointmentId: e.returnValues["appointmentId"],
                        userAddress: e.returnValues["userAddress"],
                        userFName: user[0]["FNAME"],
                        userLName: user[0]["LNAME"],
                        userEmail: user[0]["EMAIL"],
                        userHKID: user[0]["HKID_NO"],
                        userPhone: user[0]["PHONE_NO"],
                        userHomeAddress: user[0]["ADDRESS"],
                        userBirthDate: user[0]["BIRTH_DATE"],
                        clinicAddress: e.returnValues["clinicAddress"],
                        clinicName: clinic[0]["NAME"],
                        clinicLocation: clinic[0]["ADDRESS"],
                        clinicDistrict: clinic[0]["DISTRICT"],
                        clinicArea: clinic[0]["AREA"],
                        clinicImage: clinic[0]["IMAGE_PATH"],
                        index: e.returnValues["index"].toString(),
                        doctor: e.returnValues["doctor"],
                        date: e.returnValues["date"],
                        time: e.returnValues["time"],
                        status: web3.utils.hexToAscii(e.returnValues["status"]),
                    })
                }
            }
        }
        resultList.sort((a,b)=> {
            if(a["date"].concat(a["time"]) < b["date"].concat(b["time"])){
                return -1;
            }
            if(a["date"].concat(a["time"]) > b["date"].concat(b["time"])){
                return 1;
            }
            return 0;
        });
        console.log(resultList);
        res.json({data: resultList});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleGetAppointmentUsingClinicAddress(req, res, next) {
    try {
        const clinicAddress = req.params.wallet_address;

        const newAppointmentEvent = await appointmentServices.getAppointmentByNewEventUsingClinicAddress(clinicAddress);
        const updateAppointmentEvent = await appointmentServices.getAppointmentByUpdateEventUsingClinicAddress(clinicAddress);
        let resultList = [];
        let updateLogReturnList = [];
        const clinic = await appointmentServices.getAppointmentClinicInfo(clinicAddress);
        if(updateAppointmentEvent.length>0){
            updateAppointmentEvent.forEach((e)=>{
                updateLogReturnList.push({
                    appointmentId: e.returnValues["appointmentId"],
                    userAddress: e.returnValues["userAddress"],
                    clinicAddress: e.returnValues["clinicAddress"],
                    index: e.returnValues["index"].toString(),
                    doctor: e.returnValues["doctor"],
                    date: e.returnValues["date"],
                    time: e.returnValues["time"],
                    status: web3.utils.hexToAscii(e.returnValues["status"]),
                })
            })
        }
        if(newAppointmentEvent.length>0){
            for (const e of newAppointmentEvent) {
                const user = await appointmentServices.getAppointmentUserInfo(e.returnValues["userAddress"]);

                if(updateLogReturnList.length > 0){
                    const findInUpdateLog = updateLogReturnList.findLast((update)=> e["appointmentId"] === update["appointmentId"]);
                    if(findInUpdateLog.length>0){
                        resultList.push({
                            appointmentId: findInUpdateLog.returnValues["appointmentId"],
                            userAddress: findInUpdateLog.returnValues["userAddress"],
                            userFName: user[0]["FNAME"],
                            userLName: user[0]["LNAME"],
                            userEmail: user[0]["EMAIL"],
                            userHKID: user[0]["HKID_NO"],
                            userPhone: user[0]["PHONE_NO"],
                            userHomeAddress: user[0]["ADDRESS"],
                            userBirthDate: user[0]["BIRTH_DATE"],
                            clinicAddress: findInUpdateLog.returnValues["clinicAddress"],
                            clinicName: clinic[0]["NAME"],
                            clinicLocation: clinic[0]["ADDRESS"],
                            clinicDistrict: clinic[0]["DISTRICT"],
                            clinicArea: clinic[0]["AREA"],
                            clinicImage: clinic[0]["IMAGE_PATH"],
                            index: findInUpdateLog.returnValues["index"].toString(),
                            doctor: findInUpdateLog.returnValues["doctor"],
                            date: findInUpdateLog.returnValues["date"],
                            time: findInUpdateLog.returnValues["time"],
                            status: web3.utils.hexToAscii(findInUpdateLog.returnValues["status"]),
                        })
                    }else {
                        resultList.push({
                            appointmentId: e.returnValues["appointmentId"],
                            userAddress: e.returnValues["userAddress"],
                            userFName: user[0]["FNAME"],
                            userLName: user[0]["LNAME"],
                            userEmail: user[0]["EMAIL"],
                            userHKID: user[0]["HKID_NO"],
                            userPhone: user[0]["PHONE_NO"],
                            userHomeAddress: user[0]["ADDRESS"],
                            userBirthDate: user[0]["BIRTH_DATE"],
                            clinicAddress: e.returnValues["clinicAddress"],
                            clinicName: clinic[0]["NAME"],
                            clinicLocation: clinic[0]["ADDRESS"],
                            clinicDistrict: clinic[0]["DISTRICT"],
                            clinicArea: clinic[0]["AREA"],
                            clinicImage: clinic[0]["IMAGE_PATH"],
                            index: e.returnValues["index"].toString(),
                            doctor: e.returnValues["doctor"],
                            date: e.returnValues["date"],
                            time: e.returnValues["time"],
                            status: web3.utils.hexToAscii(e.returnValues["status"]),
                        })
                    }
                }else{
                    resultList.push({
                        appointmentId: e.returnValues["appointmentId"],
                        userAddress: e.returnValues["userAddress"],
                        userFName: user[0]["FNAME"],
                        userLName: user[0]["LNAME"],
                        userEmail: user[0]["EMAIL"],
                        userHKID: user[0]["HKID_NO"],
                        userPhone: user[0]["PHONE_NO"],
                        userHomeAddress: user[0]["ADDRESS"],
                        userBirthDate: user[0]["BIRTH_DATE"],
                        clinicAddress: e.returnValues["clinicAddress"],
                        clinicName: clinic[0]["NAME"],
                        clinicLocation: clinic[0]["ADDRESS"],
                        clinicDistrict: clinic[0]["DISTRICT"],
                        clinicArea: clinic[0]["AREA"],
                        clinicImage: clinic[0]["IMAGE_PATH"],
                        index: e.returnValues["index"].toString(),
                        doctor: e.returnValues["doctor"],
                        date: e.returnValues["date"],
                        time: e.returnValues["time"],
                        status: web3.utils.hexToAscii(e.returnValues["status"]),
                    })
                }
            }
        }
        resultList.sort((a,b)=> {
            if(a["date"].concat(a["time"]) < b["date"].concat(b["time"])){
                return -1;
            }
            if(a["date"].concat(a["time"]) > b["date"].concat(b["time"])){
                return 1;
            }
            return 0;
        });
        console.log("-----------");
        console.log(resultList);
        console.log("-----------");
        res.json({data: resultList});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}
