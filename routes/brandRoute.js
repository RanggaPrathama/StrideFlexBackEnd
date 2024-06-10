import  express  from "express";
import {indexBrand, storeBrand} from "../controller/brandController.js";

import { verifyToken } from "../middleware/verifyToken.js";


const routerBrand = express.Router();


routerBrand.get('/',  indexBrand);
routerBrand.post('/create', storeBrand);



export default routerBrand;