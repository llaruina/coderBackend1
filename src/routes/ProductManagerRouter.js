import { Router } from "express"
import { ProductManager } from "../dao/productManager.js"
import { CartManager } from "../dao/CartManager.js"
import { procesaErrores } from "../Errores.js"
import { serverSocket } from '../app.js'

export const routerProduct = Router()

//const productManager = new ProductManager("./src/data/products.json");
const productManager = new ProductManager();

routerProduct.get("/", async (req, res) => {

    const limit = parseInt(req.query.limit)

    try {
        const productos = await productManager.getProducts()

        if (!productos.length) {
            return res.status(400).send(`Error, aun no hay productos ingresados`)
        }

        const productosLimitados = limit && !isNaN(limit) ? productos.slice(0, limit) : productos;
        res.status(200).send(productosLimitados)

    } catch (error) {
        procesaErrores(res, error)
    }
})

routerProduct.get("/:id", async (req, res) => {

    let { id } = req.params

    id = Number(id)

    if (isNaN(id)) {
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    try {
        const producto = await productManager.getProductById(id)

        if (!producto) {
            return res.status(404).send(`No existe un producto con id ${id}`)
        }

        res.status(200).send(producto)

    } catch (error) {
        procesaErrores(res, error)
    }

})


routerProduct.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !price || !status || !code || !stock || !category) {
        return res.status(400).send("Error: Todos los campos son requeridos");
    }

    if (!productManager.codigoRepetido(code)) {
        return res.status(400).send("Error: el codigo esta repetido");
    }

    try {

        await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);

        res.status(201).send("Producto agregado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }


});


routerProduct.put("/:id", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body; // Extraemos los campos del cuerpo de la solicitud

    let { id } = req.params

    id = Number(id)

    if (isNaN(id)) {
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    try {
        const producto = await productManager.getProductById(id)

        if (!producto) {
            return res.status(404).send(`No existe un producto con id ${id}`)
        }

        await productManager.modifyProduct(id, title, description, code, price, status, stock, category, thumbnail);

        res.status(201).send("Producto modificado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }

});

routerProduct.delete("/:id", async (req, res) => {

    let { id } = req.params

    id = Number(id)

    if (isNaN(id)) {
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    try {
        const producto = await productManager.getProductById(id)

        if (!producto) {
            return res.status(404).send(`No existe un producto con id ${id}`)
        }

        await productManager.deleteProduct(id);

        res.status(201).send("Producto eliminado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }
});

