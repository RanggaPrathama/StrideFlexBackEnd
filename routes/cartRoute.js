import express from 'express';
import { indexCart,createCart,updateQuantity, deleteCart } from '../controller/CartController.js';

const routerCart = express.Router()

routerCart.get('/cart/:id_user',indexCart)
routerCart.post('/createcart', createCart)
routerCart.put('/cart/update', updateQuantity)
routerCart.put('/cart/delete', deleteCart)
export default routerCart;