import User from "../models/user";
import crypto from "crypto";

export default class AuthService {
    async getUserInfoItems(){

    }

    async getUserInfoSingle(email){
        return User.findOne({EMAIL: email});
    }

    async addUserInfo(userDoc){
        return await User.create(userDoc);
    }
}