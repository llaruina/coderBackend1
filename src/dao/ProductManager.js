import fs from 'fs';
import fsPromesas from 'fs/promises';

export class ProductManager {
     #path = "";

    constructor(path) {
        this.products = [];
        this.#path = path;
    }

    setPath(rutaArchivo=""){
        this.#path=rutaArchivo
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
            this.products = [];
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

        const producto = { id, title, description, code, price, status, stock, category, thumbnail};
        this.products.push(producto);
        await this.guardarArchivo();
        console.log("Se agregó el producto");
    }

    async getProducts() {
        await this.leerArchivo();
        return this.products;
    }

    async getProductById(id) {
        await this.getProducts(); 
        const producto = this.products.find(producto => producto.id === id);

        if (!producto) {
            console.log('Producto no encontrado');
            return null;
        }

        return producto;
    }

    async modifyProduct(id, title = "", description = "", code = "", price = null, status=true,  stock = null, category = "", thumbnail = "", ) {
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

        await this.guardarArchivo(); 
        console.log("Producto modificado.");
    }

    async deleteProduct(id) {
        const indice = this.products.findIndex(product => product.id === id);

        if (indice !== -1) {
            this.products.splice(indice, 1);
            await this.guardarArchivo(); 
            console.log(`Producto con ID ${id} eliminado.`);
        } else {
            console.log(`Producto con ID ${id} no encontrado.`);
        }
    }

}
