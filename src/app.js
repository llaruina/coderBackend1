import { CartManager } from "./dao/CartManager.js"
import { routerProduct as productsManagerRouter } from "./routes/ProductManagerRouter.js"
import { router as cartsManagerRouter } from "./routes/CartManagerRouter.js"
import { ProductManager } from "./dao/ProductManager.js"
import { vistaRouter } from "./routes/viewsRouter.js"

import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"

const productManager = new ProductManager("./src/data/products.json")

const PORT = 8080

const app = express()

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products", productsManagerRouter)
app.use("/api/carts", cartsManagerRouter)
app.use("/products", vistaRouter)

app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

const serverHttp = app.listen(PORT, () => {
    console.log(`Server online en puerto ${PORT}`)
})

export const serverSocket = new Server(serverHttp)

serverSocket.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("requestProducts", async () => {
        const products = await productManager.getProducts();
        socket.emit("productListUpdate", products);
    });

});