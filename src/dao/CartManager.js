import { cartsModelo } from '../dao/models/carts.model.js';

export class CartManager {
    constructor() { }

    async addCart(products = []) {
        try {
            const cart = { products };
            console.log("Se agregó el carrito");
            return await cartsModelo.create(cart);
        } catch (error) {
            console.error("Error al agregar carrito:", error);
            throw error;
        }
    }

    async getCart(id) {
        try {
            const cart = await cartsModelo.findById(id).lean();
            if (!cart) {
                console.log('Carrito no encontrado');
                return null;
            }

            return cart;

        } catch (error) {
            console.error("Error al obtener carrito:", error);
            throw error;
        }
    }

    async getCarts() {
        try {

            return await cartsModelo.find().lean();

        } catch (error) {
            console.error("Error al obtener carrito:", error);
            throw error;
        }
    }

    async addProductToCart(idCart, idProduct) {

        try {
            const cart = await this.getCart(idCart);

            if (!cart) {
                console.log('Carrito no encontrado');
                return null;
            }

            const productIndex = cart.products.findIndex(product => product.id === idProduct);
            if (productIndex === -1) {
                cart.products.push({ id: idProduct, quantity: 1 });
                console.log("Producto no encontrado, se crea uno nuevo");
            } else {
                cart.products[productIndex].quantity += 1;
                console.log("Producto encontrado, se incrementa cantidad");
            }

            await cartsModelo.findByIdAndUpdate(idCart, { products: cart.products });
            console.log("Se actualizó el carrito con el producto");

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }
}