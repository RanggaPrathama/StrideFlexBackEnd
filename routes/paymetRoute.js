import express from 'express';
import { getPayment, createPayment,getPaymentId } from '../controller/paymentController.js';

const routePayment = express.Router()

routePayment.get('/payment',getPayment)
routePayment.get('/payment/:idPayment', getPaymentId)
routePayment.post('/payment/create',createPayment)


export default routePayment;