
import HealthRecordService from '../services/healthRecordService'
import AppointmentService from "../services/appointmentService";
import User from "../models/user";
import crypto from "crypto";

const healthRecordService = new HealthRecordService();
const appointmentServices = new AppointmentService();
export async function handleGetUserQrcode(req, res, next) {
    try {
        const email = req.params.email;
        const qrcode = await healthRecordService.getQrCode(email);
        if (!qrcode) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json({ data: qrcode });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleCheckAppointmentWithId(req, res, next) {
    try {
        const id = req.params.appointment_id;
        const userAddress = req.params.user_address;
        const clinicAddress = req.params.clinic_address;
        const isExist = await healthRecordService.checkUserAddressValid(userAddress);
        if(isExist){
            const isSuccess = await healthRecordService.addTrustHealthProvider(userAddress, clinicAddress);
            if (!isSuccess) {
                return res.status(400).json({ msg: "Fail" });
            }
        }
        res.json({ data: isExist });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleCheckAppointmentWithoutId(req, res, next) {
    try {
        const userAddress = req.params.user_address;
        const clinicAddress = req.params.clinic_address;
        const isExist = await healthRecordService.checkUserAddressValid(userAddress);
        if(isExist){
            const isSuccess = await healthRecordService.addTrustHealthProvider(userAddress, clinicAddress);
            if (!isSuccess) {
                return res.status(400).json({ msg: "Fail" });
            }
        }
        res.json({ data: isExist });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleGetClinic(req, res, next) {
    try {
        const email = req.params.email;
        const clinic = await healthRecordService.getClinicByEmail(email);
        if (!clinic) {
            return res.status(400).json({ msg: "No data found" });
        }
        res.json({ data: clinic });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleGetUser(req, res, next) {
    try {
        const address = req.params.wallat_address;
        const user = await healthRecordService.getUserByWalletAddress(address);
        if (!user) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json({ data: user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleAddHealthRecord(req, res, next) {
    try {
        const {
            appointmentId,
            clinicWalletAddress,
            userWalletAddress,
            doctor,
            services,
            diagnosis,
            treatment,
            medications,
            remarks
        } = req.body;
        const recordStr = JSON.stringify({services: services, diagnosis: diagnosis, treatment: treatment, medications: medications});
        const doctorId = await healthRecordService.getDoctorIdByName(doctor);
        const contractSuccess = await healthRecordService.addHealthRecordToContract(appointmentId, clinicWalletAddress, userWalletAddress, doctor, recordStr, remarks);
        const dbSuccess = await healthRecordService.addHealthRecordToAppointment(appointmentId, clinicWalletAddress, userWalletAddress, doctorId, recordStr, remarks);
        // const updateAppointmentStatus = await healthRecordService.updateStatus();
        if (!contractSuccess) {
            return res.status(400).json({ msg: "Fail(BC)" });
        }
        if (!dbSuccess) {
            return res.status(400).json({ msg: "Fail(DB)" });
        }

        res.json({ data: (contractSuccess && dbSuccess) });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


export async function handleGetHealthRecordByUserAddress(req, res, next) {
    try {
        const userWalletAddress = req.params.wallet_address;
console.log(userWalletAddress)
        const contractData = await healthRecordService.getHealthRecordFromContractByUser(userWalletAddress);

        if (!contractData) {
            return res.status(400).json({ msg: "Fail(BC)" });
        }
        const resultList = [];
        const user = await appointmentServices.getAppointmentUserInfo(userWalletAddress);
        for (const e of contractData) {
            const clinic = await appointmentServices.getAppointmentClinicInfo(e.returnValues["clinicAddress"]);
            const record = JSON.parse(e.returnValues["record"]);
            resultList.push({
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
                appointmentId: e.returnValues["appointment"],
                doctor: e.returnValues["doctor"],
                datetime: e.returnValues["datetime"],
                services: record["services"],
                diagnosis: record["diagnosis"],
                treatment: record["treatment"],
                medications: record["medications"],
                remarks: e.returnValues["remarks"],
            })
        }
console.log(resultList)
        res.json({ data: resultList });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
