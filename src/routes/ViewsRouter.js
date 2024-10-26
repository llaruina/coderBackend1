import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";
import { procesaErrores } from "../Errores.js";

export const vistaRouter = Router()

const productManager = new ProductManager("./src/data/products.json")


vistaRouter.get('/', async (req, res) => {
    try {
        let products = await productManager.getProducts()
        res.render("products", {
            products
        })
    } catch (error) {
        procesaErrores(res, error)
    }
})


vistaRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        procesaErrores(res, error);
    }
});
