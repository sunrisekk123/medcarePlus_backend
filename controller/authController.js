import jwt from "jsonwebtoken";
import User from '../models/user';
import Clinic from '../models/clinic';
import District from '../models/district';
import bcryptjs from "bcryptjs";
import crypto from 'crypto';
import AuthService from '../services/authService'
import {dateHyphenToDate} from '../util/convertFormat'


const authServices = new AuthService();

export async function handleLogin(req, res, next) {
    try {
        let isTrue = true;
        let isUserAccount = false;
        let isClinicAccount = false;
        const {email, password} = req.body;

        const user = await User.findOne({EMAIL: email});
        const clinic = await Clinic.findOne({EMAIL: email});
        if (!user && !clinic) {
            isTrue = false;
        }else{
            if(user){
                isUserAccount = true;
                const isMatchUser = await bcryptjs.compareSync(password, user._doc.PASSWORD);
                if (!isMatchUser) {
                    isTrue = false;
                }
            }else if(clinic){
                isClinicAccount = true;
                const isMatchClinic = await bcryptjs.compareSync(password, clinic._doc.PASSWORD)
                if (!isMatchClinic) {
                    isTrue = false;
                }
            }
        }

        if(isTrue && isUserAccount){
            const token = jwt.sign({id: user._id}, "passwordKey");
            res.json({token, accountType: "MB", data: user._doc});
        }else if(isTrue && isClinicAccount){
            const token = jwt.sign({id: clinic._id}, "passwordKey");
            res.json({token, accountType: "C",data: clinic._doc});
        } else{
            res.status(400).json({msg: "Please enter valid email and password."});
        }
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleRegister(req, res, next) {
    try {
        const {id, walletAddress, fname, lname, password, email, address, hkid, phoneNo, birthDate, pin} = req.body;

        const existingUser = await User.findOne({EMAIL: email, WALLET_ADDRESS: walletAddress});
        if (existingUser) {
            return res.status(400).json({msg: "User with same email already exists!"});
        }

        const hashedPassword = await bcryptjs.hashSync(password, 8);
        const date1 = await dateHyphenToDate(birthDate);
        // create wallet
        const keys = await authServices.createWallet();
        console.log(keys);
        console.log(keys);
        // private key process
        const resultKetInput = await authServices.encryptPrivateKey(keys.privateKey);
        console.log(resultKetInput);
        const newPin = await authServices.pinProcessing(keys.address, pin);
        console.log(newPin);
        let userDoc = new User({
            _id: "MB".concat(crypto.randomBytes(6).toString("hex")),
            EMAIL: email,
            PASSWORD: hashedPassword,
            FNAME: fname,
            LNAME: lname,
            BIRTH_DATE: date1,
            HKID_NO: hkid,
            PHONE_NO: phoneNo,
            ADDRESS: "",
            WALLET_ADDRESS: keys.address,
            PIN: newPin,
            KEY: resultKetInput
        });

        const result = await authServices.addUserInfo(userDoc)
        res.json(result);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleRegisterClinic(req, res, next) {
    try {
        const {id, walletAddress, name, password, email, area, district, address, phoneNo} = req.body;

        const existingUser = await Clinic.findOne({EMAIL: email, WALLET_ADDRESS: walletAddress});
        if (existingUser) {
            return res.status(400).json({msg: "Clinic with same email already exists!"});
        }

        const hashedPassword = await bcryptjs.hashSync(password, 8);
        let clinicDoc = new Clinic({
            _id: "C".concat(crypto.randomBytes(6).toString("hex")),
            EMAIL: email,
            PASSWORD: hashedPassword,
            AREA: area,
            DISTRICT: district,
            ADDRESS: address,
            NAME: name,
            PHONE_NO: phoneNo,
            OPENING_HRS: "",
            IMAGE_PATH: "",
            ACTIVE: "N",
            VERIFIED: "N",
            WALLET_ADDRESS: ""
        });

        const result = await authServices.addClinicInfo(clinicDoc)
        res.json(result);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleVerifyToken(req, res, next) {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleGetRandomString(req, res, next) {
    try {
        const result = crypto.randomBytes(6).toString("hex");
        res.json(result);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}

export async function handleGetDistrictOptions(req, res, next) {
    try {
        const result = await District.find();

        res.json({data: result});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
}


