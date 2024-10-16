import { ProductManager } from "./productManager.js"
import { CartManager } from "./cartManager.js"

import express from "express"


const PORT=8080

const app=express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const productManager = new ProductManager("./products.json");

const cartManager = new CartManager ("./carts.json");

app.get("/products", async (req, res)=>{
    console.log(req.url)
    console.log(req.headers)

   const limit = parseInt(req.query.limit)
   const productos = await productManager.getProducts()

    if (!productos.length){
        return res.status(400).send(`Error, aun no hay productos ingresados`)
    }

    const productosLimitados = limit && !isNaN(limit) ? productos.slice(0, limit) : productos;

    res.status(200).send(productosLimitados)
})

app.get("/products/:id", async (req, res)=>{

    let {id}=req.params

    id=Number(id)

    if(isNaN(id)){
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    const producto = await productManager.getProductById(id)

    if(!producto){
        return res.status(404).send(`No existe un producto con id ${id}`)
    }

    res.status(200).send(producto)

})


app.post("/products", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body; 

    if (!title || !description || !price || !status  || !code || !stock || !category) {
        return res.status(400).send("Error: Todos los campos son requeridos");
    }

    await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);

    res.status(201).send("Producto agregado con éxito");
});


app.put("/products/:id", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body; // Extraemos los campos del cuerpo de la solicitud

    let {id}=req.params

    id=Number(id)

    if(isNaN(id)){
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    const producto = await productManager.getProductById(id)

    if(!producto){
        return res.status(404).send(`No existe un producto con id ${id}`)
    }

    await productManager.modifyProduct(id, title, description, code, price, status, stock, category, thumbnail);

    res.status(201).send("Producto modificado con éxito");
});

app.delete("/products/:id", async (req, res) => {
    
    let {id}=req.params

    id=Number(id)

    if(isNaN(id)){
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    const producto = await productManager.getProductById(id)

    if(!producto){
        return res.status(404).send(`No existe un producto con id ${id}`)
    }

    await productManager.deleteProduct(id);

    res.status(201).send("Producto eliminado con éxito");
});

app.post("/carts", async (req, res) => {
    const { cart } = req.body; 

    await cartManager.addCart(cart);

    res.status(201).send("Carrito agregado con éxito");
});


app.get("/carts/:id", async (req, res)=>{

    let {id}=req.params

    id=Number(id)

    if(isNaN(id)){
        return res.status(400).send(`Error, el id debe ser numércio`)
    }

    const cart = await cartManager.getCart(id)

    if(!cart){
        return res.status(404).send(`No existe un carrito con id ${id}`)
    }

    res.status(200).send(cart)

})


app.post("/carts/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;
    cid = Number(cid);
    pid = Number(pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).send(`Error, el id debe ser numérico`);
    }

    const cart = await cartManager.getCart(cid); 

    if (!cart) {
        return res.status(404).send(`No existe un carrito con id ${cid}`);
    }

    await cartManager.addProductToCart(cid, pid);

    res.status(201).send("Producto agregado al carrito con éxito");
});



app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})