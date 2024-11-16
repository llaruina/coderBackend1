import { Router } from "express"
import { CartManager } from "../dao/CartManager.js"
import { ProductManager } from "../dao/productManager.js"
import { procesaErrores } from "../Errores.js"
import mongoose from "mongoose"

export const router = Router()

//const cartManager = new CartManager("./src/data/carts.json");
//const productManager = new ProductManager("./src/data/products.json")

const cartManager = new CartManager();
const productManager = new ProductManager()

router.post("/", async (req, res) => {
    const { cart } = req.body;

    try {
        const myCart = await cartManager.addCart(cart);

        res.status(201).send("Carrito agregado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }
});


router.get("/", async (req, res) => {

    try {
        const cart = await cartManager.getCarts()

        if (!cart) {
            return res.status(404).send(`No existen carritos`)
        }

        res.status(200).send(cart)

    } catch (error) {
        procesaErrores(res, error)
    }

})


router.get("/:id", async (req, res) => {

    let { id } = req.params

    try {
        const cart = await cartManager.getCart(id)

        if (!cart) {
            return res.status(404).send(`No existe un carrito con id ${id}`)
        }

        res.status(200).send(cart)

    } catch (error) {
        procesaErrores(res, error)
    }
});


router.post("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error(`El cid o pid proporcionado no es válido`);
        }

        const cart = await cartManager.getCart(cid);
        const product = await productManager.getProductById(pid)

        if (!cart || !product) {
            return res.status(404).send(`No existe un carrito con id ${cid} o un producto con id ${pid}`);
        }

        await cartManager.addProductToCart(cid, pid);

        res.status(201).send("Producto agregado al carrito con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }
});


router.put("/:cid", async (req, res) => {

    let { cid } = req.params;
    let productos = req.body;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error(`El cid proporcionado no es válido`);
        }

        const cart = await cartManager.getCart(cid);

        if (!cart) {
            return res.status(404).send(`No existe un carrito con id ${cid}`);
        }


        for (const producto of productos) {

            const product = await productManager.getProductByCode(producto.code);

            if (!product) {
                return res.status(404).send(`No existe un producto con el codigo ${producto.code}. Se agregaron los productos anteriores al carrito`);
            }

            await cartManager.addProductToCart(cid, product._id);
        }

        res.status(201).send("Productos agregados al carrito con éxito");

    } catch (error) {
        procesaErrores(res, error);
    }
});


router.delete("/:cid", async (req, res) => {

    let { cid } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            throw new Error(`El cid o pid proporcionado no es válido`);
        }

        const carrito = await cartManager.getCart(cid)

        if (!carrito) {
            return res.status(404).send(`No existe un carrito con id ${cid}`)
        }

        await cartManager.deleteCartProducts(cid);

        res.status(201).send("Productos eliminados del carrito");

    } catch (error) {
        procesaErrores(res, error)
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {

    let { cid, pid } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error(`El cid o pid proporcionado no es válido`);
        }

        const producto = await productManager.getProductById(pid)
        const carrito = await cartManager.getCart(cid)

        if (!producto) {
            return res.status(404).send(`No existe un producto con id ${pid}`)
        }

        if (!carrito) {
            return res.status(404).send(`No existe un carrito con id ${cid}`)
        }

        await cartManager.deleteCartProduct(cid, pid);

        res.status(201).send("Producto eliminado con éxito del carrito");

    } catch (error) {
        procesaErrores(res, error)
    }
});

