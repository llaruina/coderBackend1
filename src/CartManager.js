import fs from 'fs';
import fsPromesas from 'fs/promises';
import { CartProduct } from './CartProduct';

export class CartManager {
    #path = "";

    constructor(path) {
        this.carts = [];
        this.#path = path;
    }


    async guardarArchivo() {
        await fsPromesas.writeFile(this.#path, JSON.stringify(this.carts,null, 2));
        console.log("Archivo generado...!!!");
    }

    async leerArchivo() {
        try {
            const archivoLeido = await fsPromesas.readFile(this.#path, { encoding: "utf-8" });
            this.carts = JSON.parse(archivoLeido);
        } catch (error) {
            console.log("No se pudo leer el archivo o el archivo no existe");
            this.carts = []; 
        }
    }

    async addCart(products = []) {
        await this.leerArchivo();

        let id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;

        const cart = { id, products };
        this.carts.push(cart);
        await this.guardarArchivo();
        console.log("Se agregó el carrito");

    return cart;
    }
    
    async getCart(id) {
        await this.leerArchivo(); 
        const cart = this.carts.find(cart => cart.id === id);

        if (!cart) {
            console.log('Carrito no encontrado');
            return null; 
        }

        return cart;
    }

    async addProductToCart(idCart, idProduct) {
        await this.leerArchivo();
    
        const cart = this.carts.find(cart => cart.id === idCart);
    
        if (!cart) {
            console.log('Carrito no encontrado');
            return null; 
        }
    
        let producto = cart.products.find(producto => producto.id === Number(idProduct));
    
        if (!producto) {
            producto = new CartProduct(idProduct, 1);
            cart.products.push(producto);
        } else {
            producto.quantity++;
        }
    
        await this.guardarArchivo();
        console.log("Se agregó el producto al carrito");
    }
}