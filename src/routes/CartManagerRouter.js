import { Router } from "express"
import { CartManager } from "../dao/CartManager.js"
import { procesaErrores } from "../Errores.js"

export const router = Router()

const cartManager = new CartManager("./src/data/carts.json");


router.post("/", async (req, res) => {
    const { cart } = req.body;

    try {
        const myCart = await cartManager.addCart(cart);

        res.status(201).send("Carrito agregado con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }
});


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

        if (!cart) {
            return res.status(404).send(`No existe un carrito con id ${cid}`);
        }

        await cartManager.addProductToCart(cid, pid);

        res.status(201).send("Producto agregado al carrito con éxito");

    } catch (error) {
        procesaErrores(res, error)
    }
});