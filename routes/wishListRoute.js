import { addWishList,removeWishList,getWishList} from '../controller/wishListController.js';
import express from 'express';

const routerWishList = express.Router();

routerWishList.post('/addWishlist', addWishList)
routerWishList.delete('/deleteWishlist/:id_user/:idDetail_sepatu', removeWishList)
routerWishList.get('/wishList/:id_user',getWishList)

export default routerWishList;

