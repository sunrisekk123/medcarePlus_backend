import jwt from "jsonwebtoken";
import User from '../models/user';
import bcryptjs from "bcryptjs";
import crypto from 'crypto';
import AuthService from '../services/authService'

const authServices = new AuthService();

export async function handleLogin(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ EMAIL: email });
        if (!user) {
            return res.status(400).json({ msg: "User with this email does not exist!" });
        }

        const isMatch = await bcryptjs.compare(password, user._doc.PASSWORD);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, data: user._doc });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleRegister(req, res, next) {
    try {
        const { id, walletAddress, fname, lname, password, email, address, hkid, phoneNo, birthDate } = req.body;

        const existingUser = await User.findOne({ EMAIL: email, WALLET_ADDRESS: walletAddress });
        if (existingUser) {
            return res.status(400).json({ msg: "User with same email already exists!" });
        }

        const hashedPassword = await bcryptjs.hash(password, 8);
        const date1 = await dateHyphenToDate(birthDate);
        let userDoc = new User({
            _id:  "MB".concat(crypto.randomBytes(6).toString("hex")),
            EMAIL: email,
            PASSWORD: hashedPassword,
            FNAME: fname,
            LNAME: lname,
            BIRTH_DATE: date1,
            HKID_NO: hkid,
            PHONE_NO: phoneNo,
            ADDRESS: "",
            WALLET_ADDRESS: ""
        });

        const result = await authServices.addUserInfo(userDoc)
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleVerifyToken(req, res, next) {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);

        // const user = await User.findById(verified.id);
        // if (!user) return res.json(false);
        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleTest(req, res, next) {
    try {

        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}