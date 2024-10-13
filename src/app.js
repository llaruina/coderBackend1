import { ProductManager } from "./productManager.js"
import express from "express"


const PORT=8080

const app=express()


const productManager = new ProductManager("./products.json");

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




app.listen(PORT, ()=>{
    console.log(`Server online en puerto ${PORT}`)
})