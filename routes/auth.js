import express from 'express'
import auth from '../middleware/auth'
import {handleLogin, handleRegister, handleVerifyToken, handleTest} from '../controller/authController'

const router = express.Router();

router.get("/verify_token", auth, handleVerifyToken);
router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.get("/register", handleTest);



module.exports = router;