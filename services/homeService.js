import Clinic from "../models/clinic";
import User from "../models/user";
import ClinicDoctor from "../models/clinicDoctor";
import bcryptjs from "bcryptjs";


export default class HomeService {
    async getClinicItems(){
        return Clinic.aggregate([
            {
                $match:{
                    ACTIVE:"Y"
                }
            },
            {
            $lookup:{
                from: "MAS_CLINIC_DOCTOR_INFO",
                localField: "_id",
                foreignField: "CLINIC_ID",
                as: "DOCTOR_INFO"
            }
        }]);
    }
    async getDoctorItems(){
        return ClinicDoctor.aggregate([{
            $lookup:{
                from: "MAS_CLINIC_INFO",
                localField: "CLINIC_ID",
                foreignField: "_id",
                as: "CLINIC_INFO"
            }
        }]);
    }

    async getClinicItemsByEmail(email){
        return Clinic.aggregate([
            {
                $match:{EMAIL: email}
            },
            {
            $lookup:{
                from: "MAS_CLINIC_DOCTOR_INFO",
                localField: "_id",
                foreignField: "CLINIC_ID",
                as: "DOCTOR_INFO"
            }
        }]);
    }

    async getUser(email){
        return User.find({EMAIL: email});
    }

    async updateUser(email, password, birth, hkid, address, phone, lname, fname){
        const isPassword = password.toString().length > 0;
        const isBirth = birth.toString().length > 0;
        const isHkid = hkid.toString().length > 0;
        const isAddress = address.toString().length > 0;
        const isPhone = phone.toString().length > 0;
        const isLname = lname.toString().length > 0;
        const isFname = fname.toString().length > 0;
        const current = this.getUser(email);
        const passwordInsert = isPassword ? password : current["PASSWORD"];
        const birthInsert = isBirth ? birth : current["BIRTH_DATE"];
        const hkidInsert = isHkid ? hkid : current["HKID_NO"];
        const addressInsert = isAddress ? address : current["ADDRESS"];
        const phoneInsert = isPhone ? phone : current["PHONE_NO"];
        const lnameInsert = isLname ? lname : current["LNAME"];
        const fnameInsert = isFname ? fname : current["FNAME"];


        return User.findOneAndUpdate({EMAIL: email},
            {PASSWORD: passwordInsert,
                BIRTH_DATE:birthInsert,
                HKID_NO: hkidInsert,
                ADDRESS: addressInsert,
                PHONE_NO: phoneInsert,
                LNAME: lnameInsert,
                FNAME: fnameInsert
            });
    }
    async updateClinic(email, password, openingHrs, area, district, address, phone, name){
        const isPassword = password.toString().length > 0;
        const isOpenHrs = openingHrs.toString().length > 0;
        const isArea = area.toString().length > 0;
        const isDistrict = district.toString().length > 0;
        const isAddress = address.toString().length > 0;
        const isPhone = phone.toString().length > 0;
        const isName = name.toString().length > 0;
        const current = this.getUser(email);
        const passwordInsert = isPassword ? password : current["PASSWORD"];
        const openingHrsInsert = isOpenHrs ? isOpenHrs : current["OPENING_HRS"];
        const areaInsert = isArea ? hkid : current["AREA"];
        const districtInsert = isDistrict ? hkid : current["DISTRICT"];
        const addressInsert = isAddress ? address : current["ADDRESS"];
        const phoneInsert = isPhone ? phone : current["PHONE_NO"];
        const nameInsert = isName ? name : current["NAME"];


        return Clinic.findOneAndUpdate({EMAIL: email},
            {PASSWORD: passwordInsert,
                OPENING_HRS:openingHrsInsert,
                AREA: areaInsert,
                DISTRICT: districtInsert,
                ADDRESS: addressInsert,
                PHONE_NO: phoneInsert,
                NAME: nameInsert,
            });
    }

    async updateUserPin(email, pin){
        const newPin = await bcryptjs.hashSync(pin);
        return User.findOneAndUpdate({EMAIL: email}, {PIN: newPin});
    }

    async verifyUserPin(email, pin){
        const user = await User.findOne({EMAIL: email});
        return  await bcryptjs.compareSync(pin, user._doc.PIN);
    }
}