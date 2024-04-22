import express from 'express'
import {getUkuran, createUkuran} from '../controller/ukuranController.js'

const routerUkuran = express.Router()

routerUkuran.get('/', getUkuran)
routerUkuran.post('/create', createUkuran)

export default routerUkuran;