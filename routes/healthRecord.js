import express from 'express'
import {
    handleGetUserQrcode,
    handleCheckAppointmentWithId,
    handleCheckAppointmentWithoutId,
    handleGetClinic,
    handleGetUser,
    handleAddHealthRecord,
    handleGetHealthRecordByUserAddress,
    handleGetHealthRecordByAppointmentId,
    handleGetTrustProviderUser,
    handleUpdateTrustProviderStatusUser
} from '../controller/healthRecordController'
import auth from "../middleware/auth";

const router = express.Router();

router.get("/qr_code/:email", auth, handleGetUserQrcode);
router.get("/trust_provider/:user_address", handleGetTrustProviderUser);
router.get("/clinic/:email", handleGetClinic);
router.get("/user/:wallat_address", handleGetUser);
router.get("/view_user/:wallet_address", handleGetHealthRecordByUserAddress);
router.get("/appointment_check_without/:user_address/:clinic_address", handleCheckAppointmentWithoutId);
router.get("/appointment/:appointment_id/:user_address", handleGetHealthRecordByAppointmentId);

router.post("/insert", handleAddHealthRecord);
router.post("/appointment_check", handleCheckAppointmentWithId);
router.post("/trust_provider/status", handleUpdateTrustProviderStatusUser);

module.exports = router;