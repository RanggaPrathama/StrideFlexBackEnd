import {getColor, createColor} from '../controller/colorController.js'
import express from 'express';

const routerColor = express.Router()

routerColor.get('/', getColor)
routerColor.post('/create',createColor)


export default routerColor;