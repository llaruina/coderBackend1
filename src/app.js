import { CartManager } from "./dao/CartManager.js"
import { routerProduct as productsManagerRouter } from "./routes/ProductManagerRouter.js"
import { router as cartsManagerRouter } from "./routes/CartManagerRouter.js"

import express from "express"


const PORT = 8080

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsManagerRouter)
app.use("/api/carts", cartsManagerRouter)


app.listen(PORT, () => {
    console.log(`Server online en puerto ${PORT}`)
})