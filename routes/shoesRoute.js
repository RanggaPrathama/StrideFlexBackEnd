import { createShoes, indexShoes, tesApi, getShoesByIdBrand } from "../controller/shoesController.js";
import express from 'express'

const routerShoes = express.Router();

routerShoes.get('/', indexShoes);
routerShoes.post('/create', createShoes);
routerShoes.get('/brand/:id_brand', getShoesByIdBrand);
routerShoes.get('/api/shoes', tesApi);

export default routerShoes;