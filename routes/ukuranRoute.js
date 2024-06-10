import express from 'express'
import {getUkuranByIdDetail, createUkuran} from '../controller/ukuranController.js'

const routerUkuran = express.Router()

routerUkuran.get('/detail/:id_detail', getUkuranByIdDetail)
routerUkuran.post('/create', createUkuran)

export default routerUkuran;