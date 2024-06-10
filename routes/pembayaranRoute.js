import express from 'express'
import { pembayaranIndex,pembayaranStore, updatePembayaran, orderItem, orderStatus, pembayaranExpired,pembayaranVerified } from '../controller/pembayaranController.js'

const routerPembayaran = express.Router()

routerPembayaran.get('/pembayaran/:idPembayaran',pembayaranIndex)
routerPembayaran.post('/pembayaran/store',pembayaranStore)
routerPembayaran.put('/pembayaran/paid/:idPembayaran',updatePembayaran)
routerPembayaran.get('/order/item/:idPembayaran', orderItem)
routerPembayaran.get('/order/status', orderStatus)
routerPembayaran.put('/pembayaran/expired/:idPembayaran',pembayaranExpired)
routerPembayaran.put('/pembayaran/verified/:idPembayaran',pembayaranVerified)

export default routerPembayaran;