import { Router } from "express";
import { productValidator } from "../middlewares/product_validators.js";
import ProductsManager from "../managers/products_manager.js";
import { __dirname } from '../path.js';

const router = Router();
const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

router.get("/", async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productsManager.getProducts();
    if (products.length > 0) {
      if (!limit) {
        return res.status(201).json(products);
      } else {
        const productsLimit = products.slice(0, limit);
        return res.status(201).json(productsLimit);
      }
    } else return res.status(201).json({ msg: "There are not products" });
  } catch (error) {
    next(error);
  }
});

router.get("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsManager.getProductById(pid);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", productValidator, async (req, res, next) => {
  try {
    const product = await productsManager.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:pid", productValidator, async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsManager.updateProduct(req.body, pid);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsManager.deleteProduct(pid);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
