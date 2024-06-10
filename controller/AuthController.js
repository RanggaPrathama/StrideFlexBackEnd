// AuthController.js

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nama_user, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Kata sandi tidak sama" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const User = await prisma.user.create({
            data: {
                nama_user: nama_user,
                email: email,
                password: hashPassword
            }
        });

        res.status(200).json({ data: User, message: "User created successfully", status: "success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                statusAktif : 1
            }
        });

        if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(400).json({ message: "Kata sandi salah" });

        const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '3h' });

        const RefreshToken = jwt.sign(user, process.env.REFRESH_KEY, { expiresIn: '1d' });

        //Tes cek exp
        checkTokenExpiration(accessToken)
        let waktuExp = checkTokenExpiration(accessToken)
        await prisma.user.update({
            data: {
                refresh_token: RefreshToken
            },
            where: {
                id_user: user.id_user
            }
        });

        res.status(200).json({ data: user, token: accessToken,waktuExp:waktuExp ,message: "Login berhasil" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAccount = async(req,res) => {
    try {
        const {idUser, email} = req.body;

        const user = await prisma.user.findFirst({
            where:{
                email: email,
                id_user: parseInt(idUser)
            }
        })

        if(!user) return res.status(404).json({message: "User not found"})
        
        const deleteAccount = await prisma.user.update({
            where:{
                email:email
            },
            data:{
                statusAktif : 0
            }
        })
        res.status(201).json({data:deleteAccount, message:"Account deleted"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const updateNewPassword = async(req,res) =>{
    try {
        const {email,password,newPassword} = req.body

        const user = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(!user) return res.status(404).json({message: "User not found"})
        const passwordvalid = await bcrypt.compare(password, user.password)
        if(!passwordvalid) return res.status(400).json({message: "Password salah"})
        
        const updateNewPassword = await bcrypt.hash(newPassword,10)

        const updatePassword = await prisma.user.update({
            where:{
                email:email
            },
            data:{
                password:  updateNewPassword
            }
        })
        res.status(200).json({data:updatePassword, messageUpdate:"Password updated"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


const checkTokenExpiration = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const expDate = new Date(decodedToken.exp * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
           
            const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
            console.log('Token masih berlaku. Waktu kedaluwarsa:', expDate);
            return expDate;
        } else {
           
            console.log('Token sudah kedaluwarsa.');
            return 0;
        }
    } catch (error) {
        // Error dalam memeriksa token
        console.error('Error dalam memeriksa token:', error.message);
        return 0;
    }
};





export {
    Register,
    Login,
    deleteAccount,
    updateNewPassword
};
