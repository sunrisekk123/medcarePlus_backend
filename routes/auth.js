import express from 'express'
import auth from '../middleware/auth'
import {
    handleLogin,
    handleRegister,
    handleVerifyToken,
    handleGetDistrictOptions,
    handleRegisterClinic,
    handleGetRandomString
} from '../controller/authController'

const router = express.Router();


router.get("/random_string", handleGetRandomString);
router.get("/district_options", handleGetDistrictOptions);

router.post("/verify_token", auth, handleVerifyToken);
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/register_clinic", handleRegisterClinic);


module.exports = router;