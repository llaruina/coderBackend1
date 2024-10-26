import { CartManager } from "./dao/CartManager.js"
import { routerProduct as productsManagerRouter } from "./routes/ProductManagerRouter.js"
import { router as cartsManagerRouter } from "./routes/CartManagerRouter.js"
import { vistaRouter } from "./routes/viewsRouter.js"


import express from "express"
import { engine } from "express-handlebars"


const PORT = 8080

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productsManagerRouter)
app.use("/api/carts", cartsManagerRouter)
app.use("/products", vistaRouter)

app.listen(PORT, () => {
    console.log(`Server online en puerto ${PORT}`)
})