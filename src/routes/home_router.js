import { Router } from "express";
import ProductsManager from "../managers/products_manager.js";
import { __dirname } from '../path.js';

const router = Router();
const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

router.get('/', async(req, res)=>{
    let products = await productsManager.getProducts();
    products = products.map(prod => {
        return {
            ...prod,
            price: prod.price
        };
    });
    res.render('home', {products});
});

export default router;
