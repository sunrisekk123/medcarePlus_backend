import express from 'express'
import auth from '../middleware/auth'
import {
    handleGetAppointmentUsingId, handleGetAppointmentUsingUserAddress,
    handleInsertAppointment,
    handleGetAppointmentUsingClinicAddress,
    handleUpdateAppointmentStatus
} from '../controller/AppointmentController'

const router = express.Router();

router.get("/booking", auth , handleGetAppointmentUsingId);
router.get("/booking/address/:wallet_address", auth, handleGetAppointmentUsingUserAddress);
router.get("/booking/clinic_address/:wallet_address", handleGetAppointmentUsingClinicAddress);
router.post("/booking", auth, handleInsertAppointment);
router.post("/status", handleUpdateAppointmentStatus);




module.exports = router;