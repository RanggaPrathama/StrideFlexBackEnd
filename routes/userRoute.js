import express from "express";
import { updateProfile,getUserProfile,createAddress, getAddressAktif,    getAddressNonAktif,  updateAddressAktif,   deleteAddress  } from "../controller/UserController.js"

const routeUser = express.Router()

routeUser.patch('/profile/update/:idUser', updateProfile)
routeUser.get('/profile/:idUser',getUserProfile)
routeUser.post('/user/address/:idUser',createAddress)
routeUser.get('/user/address/active/:idUser',getAddressAktif)
routeUser.get('/user/address/nonactive/:idUser', getAddressNonAktif)
routeUser.put('/user/address/update/:idUser/:idAlamat',  updateAddressAktif )
routeUser.delete('/user/address/delete/:idAlamat',   deleteAddress )
export default routeUser;