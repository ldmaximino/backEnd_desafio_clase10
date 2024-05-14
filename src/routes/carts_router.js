import { Router } from "express";
import CartsManager from "../managers/carts_manager.js";
import { __dirname } from '../path.js';

const router = Router();
const cartsManager = new CartsManager(`${__dirname}/data/carts.json`);

//este router no lo solicitaba el ejercicio pero lo agregué para mostrar todos los carritos
router.get('/', async (req,res, next) => {
    try {
        const carts = await cartsManager.getCarts();
        return res.status(201).json(carts);
    } catch (error) {
      next(error);
    }
})

router.get('/:cid', async (req,res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartsManager.getCartById(cid);
        if (!cart) return res.status(404).json({ msg: "Cart not found" });
        return res.status(201).json(cart);
      } catch (error) {
        next(error);
      }
})

router.post('/', async (req,res, next) => {
    try {
        const cart = await cartsManager.createCart();
        return res.status(201).json(cart);
      } catch (error) {
        next(error);
      }
})

router.post('/:cid/product/:pid', async (req,res, next) => {
    try {
        const addProductCart = await cartsManager.saveProductToCart(req.params);
        return res.status(201).json(addProductCart);
      } catch (error) {
        next(error);
      }
})

export default router;
