import { msUserModel } from "../models/MsUserModel.js";
import argon2 from "argon2";

export const msUserController = {
    async postAuthenticated(req, res) {
        try {
            const { email, password } = req.body;
            const credentials = await msUserModel.postUserCredentials( email );

            // validation
            if (!credentials){
                throw new Error("Invalid email");
            }
            const passwordValidation = await argon2.verify(credentials[0].Password, password);
            if (!passwordValidation) {
                throw new Error("Invalid password");
            }
            
            // result
            res.json({ 
                Username: credentials[0].Username, 
                Email: credentials[0].Email, 
                PhoneNumber: credentials[0].PhoneNumber 
            });
            
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async putUpdateUserData(req, res){
        try{
            const {username, phoneNumber, email} = req.body;
            const data = await msUserModel.putUpdateUserData(username, phoneNumber, email);
            res.json({ Username: data[0].Username, PhoneNumber: data[0].PhoneNumber });
        } catch (err) {
             res.status(500).json({ success: false, message: err.message });
        }
    },

    async putChangePassword(req, res){
        try{
            const {email, oldPassword, newPassword, confirmPassword} = req.body
            if (newPassword != confirmPassword) throw new Error('Please re-confirm new password')
            const dbOldPassword = await msUserModel.getOldPassword(email)

            const passwordValidation = await argon2.verify(dbOldPassword[0].Password, oldPassword)
            if (!passwordValidation) throw new Error("Invalid old password")

            const hashedPassword = await argon2.hash(newPassword, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,   // 65536 KB = 64 MB
                timeCost: 3,           // iterations
                parallelism: 1,        // threads
                hashLength: 32         // panjang output hash
            });

            const response = await msUserModel.putChangePassword(email, hashedPassword)
            res.json({ success: true, data: response })
            
        } catch (err) {
            res.status(500).json({ success: false, message: err.message })
        }
    }
}