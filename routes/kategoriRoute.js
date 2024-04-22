import {getKategori,createKategori} from '../controller/kategoriController.js';
import  express  from "express";

const routerKategori = express.Router();

routerKategori.get('/', getKategori)
routerKategori.post('/create', createKategori)    

export default routerKategori;