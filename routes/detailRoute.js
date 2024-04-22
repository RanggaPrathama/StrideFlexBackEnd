import { getDetailBySepatu, createDetail } from "../controller/detailSepatuWarna.js";
import express from "express";

const routerDetail = express.Router();

routerDetail.get('/shoes/:id_shoes', getDetailBySepatu);
routerDetail.post('/create', createDetail);

export default routerDetail;