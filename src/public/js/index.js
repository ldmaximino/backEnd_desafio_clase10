const socketClient = io();

const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const products = document.getElementById("products");
const msgError = document.getElementById("msgError");

form.onsubmit = (e) => {
    e.preventDefault();
    const title = inputTitle.value;
    const description = inputDescription.value;
    const code = inputCode.value;
    const price = inputPrice.value;
    const stock = inputStock.value;

    if(!title || !description || !code || !price || !stock) {
        msgError.innerText ="Debe completar todos los campos";
        return;
    }

    const product = {
        title,
        description,
        code,
        price,
        stock,
    };

    socketClient.emit('newProduct', product);
    inputTitle.value="";
    inputDescription.value="";
    inputCode.value="";
    inputPrice.value="";
    inputStock.value="";
}

socketClient.on('productExist', (message) => {
    msgError.innerText = message;
})

socketClient.on('products', (arrayProducts) => {
    msgError.innerText="";
    let detailProducts = '';
    arrayProducts.map((prod) => {
        detailProducts += `
            <div class="product">
                <p class="title">${prod.title}</p>
                <p class="description">${prod.description}</p>
                <p class="price">Price: $ ${prod.price}</p>
                <p class="stock">Stock: ${prod.stock}</p>
            </div>
        `
    });
    products.innerHTML = detailProducts;
})
