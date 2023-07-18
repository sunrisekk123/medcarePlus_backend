import User from '../models/user';
import HomeService from '../services/homeService'

const homeServices = new HomeService();

export async function handleGetHomepageInfo(req, res, next) {
    try {
        const clinicList = await homeServices.getClinicItems();
        if (!clinicList) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json({ data: clinicList });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleGetClinicInfo(req, res, next) {
    try {
        const userEmail = req.params.email;
        const clinicList = await homeServices.getClinicItemsByEmail(userEmail);
        if (!clinicList) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json({ data: clinicList });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export async function handleGetUserInfo(req, res, next) {
    try {
        const userEmail = req.params.email;
        const userData = await homeServices.getUser(userEmail);
        if (!userData) {
            return res.status(400).json({ msg: "No data found" });
        }
        res.json({ data: userData });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
export async function handleUpdateUserInfo(req, res, next) {
    try {
        const { email, password, birth, hkid, address, phone, lname, fname } = req.body;

        const userData = await homeServices.updateUser(email, password, birth, hkid, address, phone, lname, fname);
        if (!userData) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
export async function handleUpdateClinicInfo(req, res, next) {
    try {
        const { email, password, openingHrs, area, district, address, phone, name } = req.body;

        const clinicData = await homeServices.updateClinic(email, password, openingHrs, area, district, address, phone, name);
        if (!clinicData) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
export async function handleSetUserPIN(req, res, next) {
    try {
        const { email, pin } = req.body;
        const userData = await homeServices.updateUserPin(email, pin);
        if (!userData) {
            return res.status(400).json({ msg: "No data found" });
        }

        res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
export async function handleVerifyUserPIN(req, res, next) {
    try {
        const email = req.params.email;
        const pin = req.params.pin;

        const isTrue = await homeServices.verifyUserPin(email, pin);

        res.json(isTrue);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}