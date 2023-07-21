
import HealthRecordService from '../services/healthRecordService'
import AppointmentService from "../services/appointmentService";
import AuthService from '../services/authService'
import dotenv from 'dotenv';
import Web3 from "web3";
dotenv.config();
const ganacheServer = `http://${process.env.GANACHE_HOST}:${process.env.GANACHE_PORT}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ganacheServer));

const authServices = new AuthService();
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
        const {id, code, clinicAddress} = req.body;
        const userAddress = code;
        const isExist = await healthRecordService.checkUserAddressValid(userAddress);
        if(isExist){
            const isSuccess = await healthRecordService.addTrustHealthProvider(userAddress, clinicAddress);
            if (!isSuccess) {
                return res.status(400).json({ msg: "Fail" });
            }
        }else {
            return res.status(400).json({ msg: "User Address does not exist" });
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
            date,
            time,
            clinicWalletAddress,
            userWalletAddress,
            doctor,
            services,
            diagnosis,
            treatment,
            medications,
            remarks
        } = req.body;
        const userInfo = await healthRecordService.getUserByWalletAddress(userWalletAddress);
        const privateKeyEncrypted = userInfo[0]["KEY"];
        const privateKeyDecrypted = await authServices.decryptPrivateKey(privateKeyEncrypted);
        // encrypt the health record with private key
        const recordStr = JSON.stringify({services: services, diagnosis: diagnosis, treatment: treatment, medications: medications});
        const encryptedRecord = await healthRecordService.encryptRecordField(recordStr, privateKeyDecrypted);

        const doctorId = await healthRecordService.getDoctorIdByName(doctor);
        const contractSuccess = await healthRecordService.addHealthRecordToContract(appointmentId, clinicWalletAddress, userWalletAddress, doctor, encryptedRecord, remarks);
       const appointmentIDReal = userWalletAddress+clinicWalletAddress+date+time;
        // const updateAppointmentStatus = await appointmentServices.updateAppointmentStatus(appointmentIDReal, "D", userWalletAddress);
        if (!contractSuccess) {
            return res.status(400).json({ msg: "Fail(BC)" });
        }
        // if (!updateAppointmentStatus) {
        //     return res.status(400).json({ msg: "Fail(BC)" });
        // }

        res.json({ data: [contractSuccess.toString()] })
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
        const privateKeyDecrypted = await authServices.decryptPrivateKey(user[0]["KEY"]);
        for (const e of contractData) {
            const clinic = await appointmentServices.getAppointmentClinicInfo(e.returnValues["clinicAddress"]);

            const resultKetInput = await healthRecordService.decryptRecordField(e.returnValues["record"], privateKeyDecrypted);
            const record = JSON.parse(resultKetInput);
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
        resultList.sort((a,b)=> {
            if(a["datetime"] < b["datetime"]){
                return -1;
            }
            if(a["datetime"] > b["datetime"]){
                return 1;
            }
            return 0;
        });
console.log(resultList)
        res.json({ data: resultList });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


export async function handleGetHealthRecordByAppointmentId(req, res, next) {
    try {
        const appointmentId = req.params.appointment_id;
        const userWalletAddress = req.params.user_address;

        const contractData = await healthRecordService.getHealthRecordFromContractByAppointmentId(appointmentId);

        if (!contractData) {
            return res.status(400).json({ msg: "Fail(BC)" });
        }
        const resultList = [];
        const user = await appointmentServices.getAppointmentUserInfo(userWalletAddress);
        const privateKeyDecrypted = await authServices.decryptPrivateKey(user[0]["KEY"]);
        for (const e of contractData) {
            const clinic = await appointmentServices.getAppointmentClinicInfo(e.returnValues["clinicAddress"]);
            const resultKetInput = await healthRecordService.decryptRecordField(e.returnValues["record"], privateKeyDecrypted);
            const record = JSON.parse(resultKetInput);

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
        resultList.sort((a,b)=> {
            if(a["datetime"] < b["datetime"]){
                return -1;
            }
            if(a["datetime"] > b["datetime"]){
                return 1;
            }
            return 0;
        });
console.log(resultList)
        res.json({ data: resultList });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}



export async function handleGetTrustProviderUser(req, res, next) {
    try {
        const userWalletAddress = req.params.user_address;

        const contractData = await healthRecordService.getTrustProviderByUserAddress(userWalletAddress);

        if (!contractData) {
            return res.status(400).json({msg: "Fail(BC)"});
        }
        let resultList = [];
        if (contractData.length > 0) {
            contractData.sort((a, b) => {
                if (a.returnValues["date"] + a.returnValues["time"] < b.returnValues["date"] + b.returnValues["time"]) {
                    return 1;
                }
                if (a.returnValues["date"] + a.returnValues["time"] > b.returnValues["date"] + b.returnValues["time"]) {
                    return -1;
                }
                return 0;
            });

            for (const e of contractData) {
                const clinic = await appointmentServices.getAppointmentClinicInfo(e.returnValues["clinicAddress"]);
                if (resultList.find((re) => {return re.clinicAddress.localeCompare(e.returnValues["clinicAddress"]) === 0}) === undefined) {

                        resultList.push({
                            userAddress: e.returnValues["userAddress"],
                            clinicAddress: e.returnValues["clinicAddress"],
                            clinicName: clinic[0]["NAME"],
                            clinicEmail: clinic[0]["EMAIL"],
                            clinicArea: clinic[0]["AREA"],
                            clinicDistrict: clinic[0]["DISTRICT"],
                            clinicLocationAddress: clinic[0]["ADDRESS"],
                            date: e.returnValues["date"],
                            time: e.returnValues["time"],
                            status: web3.utils.hexToAscii(e.returnValues["status"]),
                        })

                }
            }
        }
        resultList = resultList.filter((e)=> e.status.localeCompare("A") === 0)
        console.log(resultList)
        res.json({data: resultList});
    } catch (e) {
        res.status(500).json({error: e.message});
    }

}

export async function handleUpdateTrustProviderStatusUser(req, res, next) {
    try {
        const {userAddress, clinicAddress, status} = req.body;

        const contractData = await healthRecordService.removeTrustProvider(userAddress, clinicAddress, status);

        if (!contractData) {
            return res.status(400).json({ msg: "Fail(BC)" });
        }

        res.json({ data: [contractData] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

}

