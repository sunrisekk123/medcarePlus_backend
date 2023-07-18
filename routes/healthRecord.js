import express from 'express'
import {
    handleGetUserQrcode,
    handleCheckAppointmentWithId,
    handleCheckAppointmentWithoutId,
    handleGetClinic,
    handleGetUser,
    handleAddHealthRecord, handleGetHealthRecordByUserAddress
} from '../controller/healthRecordController'
import auth from "../middleware/auth";

const router = express.Router();

router.get("/qr_code/:email", auth, handleGetUserQrcode);
router.get("/appointment_check/:appointment_id/:user_address/:clinic_address", handleCheckAppointmentWithId);
router.get("/appointment_check_without/:user_address/:clinic_address", handleCheckAppointmentWithoutId);
router.get("/clinic/:email", handleGetClinic);
router.get("/user/:wallat_address", handleGetUser);
router.get("/view_user/:wallet_address", handleGetHealthRecordByUserAddress);
router.post("/insert", handleAddHealthRecord);


module.exports = router;