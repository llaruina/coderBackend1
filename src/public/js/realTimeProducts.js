const socket = io();

socket.emit("requestProducts");

socket.on("productListUpdate", (products) => {
    const productList = document.getElementById("productos");
    productList.innerHTML = "";

    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        productList.appendChild(li);
    });
});