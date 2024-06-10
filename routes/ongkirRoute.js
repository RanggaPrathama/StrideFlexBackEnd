import express from 'express';
import { getOngkir,getOngkirByid ,storeOngkir  } from '../controller/ongkirController.js';

const routerOngkir = express.Router()

routerOngkir.get('/ongkir',getOngkir)
routerOngkir.get('/ongkir/:idOngkir',getOngkirByid)
routerOngkir.post('/ongkir/post',storeOngkir )

export default routerOngkir;