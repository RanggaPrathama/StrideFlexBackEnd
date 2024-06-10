import express from "express";
import { indexPemesanan,pemesananStore } from "../controller/pemesananController.js";

const routePemesanan = express.Router()


routePemesanan.get('/pemesanan/:idPesan/:idUser',indexPemesanan)
routePemesanan.post('/pemesanan/store',pemesananStore)


export default routePemesanan