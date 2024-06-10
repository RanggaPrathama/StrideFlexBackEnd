// authRoute.js

import express from "express";
import { Register, Login, deleteAccount, updateNewPassword } from "../controller/AuthController.js"; // Impor getProfile yang benar
import { body, validationResult } from 'express-validator';

const routeAuth = express.Router();

const ValidatorRegister = [
    body('nama_user').trim().notEmpty().withMessage('nama user tidak boleh kosong').isLength({ min: 3 }).withMessage('nama user minimal 5 karakter'),
    body('email').notEmpty().withMessage('Tidak boleh kosong').isEmail().withMessage('format Email tidak valid'),
    body('password').isLength({ min: 8 }).withMessage('Kata sandi harus terdiri dari minimal 8 karakter')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage('Kata sandi harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka'),
];


// const ValidatorLogin = [
//     body('email').notEmpty().withMessage('Tidak boleh kosong').isEmail().withMessage('format Email tidak valid'),
//     body('password').isLength({ min: 8 }).withMessage('Kata sandi harus terdiri dari minimal 8 karakter')
//     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
//     .withMessage('Kata sandi harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka'),
// ];

routeAuth.post('/register', ValidatorRegister, Register);
routeAuth.delete('/deleteAccount',deleteAccount)
routeAuth.put('/newPassword', updateNewPassword)
routeAuth.post('/login', Login);
export default routeAuth;
