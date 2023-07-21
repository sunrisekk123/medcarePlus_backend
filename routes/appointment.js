import express from 'express'
import auth from '../middleware/auth'
import {
    handleGetAppointmentUsingUserAddress,
    handleInsertAppointment,
    handleGetAppointmentUsingClinicAddress,
    handleUpdateAppointmentStatus,
    handleGetAppointmentUsingDateAndClinicAddress
} from '../controller/AppointmentController'

const router = express.Router();

router.get("/booking/address/:wallet_address", auth, handleGetAppointmentUsingUserAddress);
router.get("/booking/clinic_address/:wallet_address", handleGetAppointmentUsingClinicAddress);
router.get("/booking/check_ava_date/:date/:clinicAddress", handleGetAppointmentUsingDateAndClinicAddress);
router.post("/booking", auth, handleInsertAppointment);
router.post("/status", handleUpdateAppointmentStatus);




module.exports = router;