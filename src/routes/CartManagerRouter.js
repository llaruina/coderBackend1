import { Router } from "express"
import { CartManager } from "../dao/CartManager.js"
import { ProductManager } from "../dao/productManager.js"
import { procesaErrores } from "../Errores.js"

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

    id = Number(id)

    if (isNaN(id)) {
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    try {
        const cart = await cartManager.getCart(id)

        if (!cart) {
            return res.status(404).send(`No existe un carrito con id ${id}`)
        }

        res.status(200).send(cart)

    } catch (error) {
        procesaErrores(res, error)
    }

})





router.post("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;
    cid = Number(cid);
    pid = Number(pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).send(`Error, el id debe ser numérico`);
    }

    try {
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