import { serverSocket } from "../app.js";
import { productosModelo } from './models/products.model.js';
import mongoose from 'mongoose';

export class ProductManager {

    constructor() {

    }

    async codigoRepetido(code) {

        let productos = await this.getProducts();
        return productos.find(producto => producto.code === code);
    }

    async getProducts() {

        return await productosModelo.find().lean();
    }

    async getProductById(id) {

        return await productosModelo.findOne({ _id: id });
    }

    async getProductByCode(code) {

        return await productosModelo.findOne({ code });
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        if (!title || !description || !price || !status || !code || !stock || !category) {
            console.log("No se completaron todos los datos");
            return;
        }

        const codigoRepetido = await this.codigoRepetido(code);
        if (codigoRepetido) {
            console.log("El código del producto ya existe");
            return;
        }

        const producto = { title, description, code, price, status, stock, category, thumbnail };

        await productosModelo.create(producto);


        const products = await this.getProducts();
        serverSocket.emit("productListUpdate", products);

        console.log("Se agregó el producto");
        return producto;
    }

    async updateProduct(id, title = "", description = "", code = "", price = null, status = true, stock = null, category = "", thumbnail = "") {

        const producto = await this.getProductById(id);
        if (!producto) {
            console.log("Producto no encontrado");
            return;
        }

        producto.title = title || producto.title;
        producto.description = description || producto.description;
        producto.code = code || producto.code;
        producto.price = price || producto.price;
        producto.status = status;
        producto.stock = stock || producto.stock;
        producto.category = category || producto.category;
        producto.thumbnail = thumbnail || producto.thumbnail;

        await productosModelo.findByIdAndUpdate(id, producto);

        const products = await this.getProducts();
        serverSocket.emit("productListUpdate", products);

        console.log("Producto modificado.");
        return producto;
    }

    async deleteProduct(id) {
        const producto = await this.getProductById(id);
        if (!producto) {
            console.log("Producto no encontrado");
            return;
        }

        await productosModelo.findByIdAndDelete(id);

        const products = await this.getProducts();
        serverSocket.emit("productListUpdate", products);

        console.log("Producto eliminado.");
        return producto;
    }
}