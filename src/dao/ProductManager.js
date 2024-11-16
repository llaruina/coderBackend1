import fs from 'fs';
import fsPromesas from 'fs/promises';
import { serverSocket } from "../app.js"
import { productosModelo } from './models/products.model.js';
import mongoose from 'mongoose';

export class ProductManager {

    constructor() {
        this.products = [];
    }


    async codigoRepetido(code) {
        let productos = await this.getProducts();

        return productos.find(producto => producto.code === code);
    }


    async getProducts() {

        return await productosModelo.find().lean();
    }



    async getProductById(id) {

        return await productosModelo.findOne({ id: id })
    }


    async addProduct(title, description, code, price, status, stock, category, thumbnail) {


        if (!title || !description || !price || !status || !code || !stock || !category) {
            console.log("No se completaron todos los datos");
            return;
        }

        const codigoRepetido = await this.codigoRepetido(code)

        if (codigoRepetido) {
            console.log("El código del producto ya existe");
            return;
        }


        const producto = { title, description, code, price, status, stock, category, thumbnail };
        this.products.push(producto);

        serverSocket.emit("productListUpdate", this.products);

        console.log("Se agregó el producto");

        return await productosModelo.create(producto)
    }

    async updateProduct(id, title = "", description = "", code = "", price = null, status = true, stock = null, category = "", thumbnail = "",) {
        const producto = await this.getProductById(id);

        if (!producto) return;

        producto.title = title !== "" ? title : producto.title;
        producto.description = description !== "" ? description : producto.description;
        producto.price = price !== null ? price : producto.price;
        producto.thumbnail = thumbnail !== "" ? thumbnail : producto.thumbnail;
        producto.code = code !== "" ? code : producto.code;
        producto.stock = stock !== null ? stock : producto.stock;
        producto.status = status;
        producto.category = category !== "" ? category : producto.category;

        console.log("Producto modificado.");

        return productosModelo.findByIdAndUpdate(id, producto)
    }

    async deleteProduct(id) {

        serverSocket.emit("productListUpdate", this.products)

        return await productosModelo.findByIdAndDelete(id)
    }

}
