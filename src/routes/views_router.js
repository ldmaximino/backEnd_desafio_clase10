import { Router } from "express";
import ProductsManager from "../managers/products_manager.js";
import { __dirname } from '../path.js';

const router = Router();
const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

router.get('/', async(req, res)=>{
    const products = await productsManager.getProducts();
    res.render('realTimeProducts',{products});
});

export default router;
