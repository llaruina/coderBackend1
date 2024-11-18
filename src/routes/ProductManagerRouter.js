import { Router } from "express"
import { ProductManager } from "../dao/productManager.js"
import { CartManager } from "../dao/CartManager.js"
import { procesaErrores } from "../Errores.js"
import { serverSocket } from '../app.js'
import mongoose from "mongoose"

export const routerProduct = Router()

//const productManager = new ProductManager("./src/data/products.json");
const productManager = new ProductManager();

routerProduct.get("/", async (req, res) => {
    const {
        limit = 10,
        page = 1,
        sort,
        query
    } = req.query;

    try {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
        };

        const filtro = query ? { category: query } : {};

        const productos = await productManager.getProducts(filtro, options);

        console.log(productos)

        /*
        if (!productos.length) {
            return res.status(404).send("No se encontraron productos.");
        }
            */

        res.status(200).send({
            status: "success",
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `?page=${productos.prevPage}&limit=${limit}` : null,
            nextLink: productos.hasNextPage ? `?page=${productos.nextPage}&limit=${limit}` : null,
        });

    } catch (error) {
        procesaErrores(res, error);
    }
});


routerProduct.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`El ID proporcionado (${id}) no es un id válido`);
        }

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

    const { id } = req.params;

    const { title, description, code, price, status, stock, category, thumbnail } = req.body;


    try {
        const producto = await productManager.getProductById(id)

        if (!producto) {
            return res.status(404).send(`No existe un producto con id ${id}`)
        }

        await productManager.updateProduct(id, title, description, code, price, status, stock, category, thumbnail);

        res.status(201).send("Producto modificado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }

});

routerProduct.delete("/:id", async (req, res) => {

    let { id } = req.params

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

