import express from 'express'
import {
    handleGetHomepageInfo,
    handleGetUserInfo,
    handleUpdateUserInfo,
    handleSetUserPIN,
    handleVerifyUserPIN,
    handleGetClinicInfo,
    handleUpdateClinicInfo, handleGetHomepageDoctor
} from '../controller/homeController'
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", handleGetHomepageInfo);
router.get("/doctor", handleGetHomepageDoctor);
router.get("/user/:email", auth, handleGetUserInfo);
router.get("/clinic/:email", handleGetClinicInfo);
router.get("/user/verify_pin/:email/:pin", auth, handleVerifyUserPIN);

router.post("/user", auth, handleUpdateUserInfo);
router.post("/clinic", handleUpdateClinicInfo);
router.post("/user/set_pin", auth, handleSetUserPIN);




module.exports = router;