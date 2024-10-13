import fs from 'fs';
import fsPromesas from 'fs/promises';

export class ProductManager {
    #path = "";

    constructor(path) {
        this.products = [];
        this.#path = path;
    }

    codigoRepetido(code) {
        return this.products.find(producto => producto.code === code);
    }

    async guardarArchivo() {
        await fsPromesas.writeFile(this.#path, JSON.stringify(this.products));
        console.log("Archivo generado...!!!");
    }

    async leerArchivo() {
        try {
            const archivoLeido = await fsPromesas.readFile(this.#path, { encoding: "utf-8" });
            this.products = JSON.parse(archivoLeido);
        } catch (error) {
            console.log("No se pudo leer el archivo o el archivo no existe");
            this.products = []; // Inicializa la lista de productos si no existe el archivo
        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        let id = 1;

        if (!title || !description || !price || !status || !code || !stock || !category) {
            console.log("No se completaron todos los datos");
            return;
        } 

        await this.leerArchivo();

        if (this.codigoRepetido(code)) {
            console.log("El código del producto ya existe");
            return;
        }

        if (this.products.length > 0) {
            id = this.products[this.products.length - 1].id + 1;
        }

        const producto = { id, description, code, price, status, stock, category, thumbnail};
        this.products.push(producto);
        await this.guardarArchivo();
        console.log("Se agregó el producto");
    }

    async getProducts() {
        await this.leerArchivo();
        return this.products;
    }

    async getProductById(id) {
        await this.getProducts(); // Asegúrate de que los productos estén cargados
        const producto = this.products.find(producto => producto.id === id);

        if (!producto) {
            console.log('Producto no encontrado');
            return null; // Cambié para devolver null en caso de no encontrar el producto
        }

        return producto;
    }

    async modifyProduct(id, title = "", description = "", code = "", price = null, status=true,  stock = null, category = "", thumbnail = "", ) {
        const producto = await this.getProductById(id); // Asegúrate de usar await

        if (!producto) return; // Sal de la función si el producto no se encuentra

        producto.title = title !== "" ? title : producto.title;
        producto.description = description !== "" ? description : producto.description;
        producto.price = price !== null ? price : producto.price;
        producto.thumbnail = thumbnail !== "" ? thumbnail : producto.thumbnail;
        producto.code = code !== "" ? code : producto.code;
        producto.stock = stock !== null ? stock : producto.stock;
        producto.status = status;
        producto.category = category !== "" ? category : producto.category;

        await this.guardarArchivo(); // Guarda los cambios
        console.log("Producto modificado.");
    }

    async deleteProduct(id) {
        const indice = this.products.findIndex(product => product.id === id);

        if (indice !== -1) {
            this.products.splice(indice, 1);
            await this.guardarArchivo(); // Guarda los cambios
            console.log(`Producto con ID ${id} eliminado.`);
        } else {
            console.log(`Producto con ID ${id} no encontrado.`);
        }
    }
}

// Ejemplo de uso
/*
const productManager = new ProductManager("./products.json");

(async () => {
    await productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
    await productManager.addProduct('producto 2', 'Producto 2', 300, 'Sin imagen', 'abyedgf', 20);
    console.log(await productManager.getProducts());
    await productManager.modifyProduct(1, 'producto modificado', 'Este es un producto modificado', 200, 'Sin imagen', 'abc123', 25);
    await productManager.deleteProduct(1);
    console.log(await productManager.getProducts());
})();
*/