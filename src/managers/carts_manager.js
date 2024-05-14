import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./products_manager.js";
import { __dirname } from '../path.js';

const productsManager = new ProductManager(`${__dirname}/data/products.json`);

export default class CartsManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
      } else return [];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cartExist = carts.find((ca) => ca.id === cid);
      if (!cartExist) return null;
      return cartExist;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createCart(obj) {
    try {
      const cart = { id: uuidv4(), products: [] };
      const carts = await this.getCarts();
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return { status: "Cart created", cart };
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveProductToCart(obj) {
    try {
      const { cid, pid } = obj;
      const productExist = await productsManager.getProductById(pid); //verifica si existe el producto
      if(!productExist) throw new Error('Product not found');
      const cart = await this.getCartById(cid); //verifica si existe el carrito
      if (!cart) throw new Error('Cart not found');
      const existProductIndex = cart.products.findIndex(
        (prod) => prod.product === pid
      );
      if (existProductIndex !== -1) {
        cart.products[existProductIndex].quantity++; //si el producto existe en el carrito, suma 1 a la cantidad
      } else {
        cart.products.push({
          product: pid,
          quantity: 1,
        }); //si el producto no existe en el carrito lo agrega con cantidad igual 1
      }
      //Actualizamos todos los carritos
      const carts = await this.getCarts();
      const newCarts = carts.filter((ca) => ca.id !== cid); //genero un nuevo array que no incluya al carrito al cual le agregamos el producto
      newCarts.push(cart); //se agrega el carrito actualizado al nuevo array de carritos
      await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
      return { status: "Product added to cart", cart };
    } catch (error) {
      throw new Error(error);
    }
  }
}
