import express from 'express';
import products_router from './routes/products_router.js';
import carts_router from './routes/carts_router.js';
import home_router from './routes/home_router.js';
import views_router from './routes/views_router.js';
import { errorHandler } from './middlewares/error_handler.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductsManager from "./managers/products_manager.js";
import { __dirname } from "./path.js";

const app = express();
const PORT = process.env.PORT || 8080;
const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//configurando handlebars
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('views', __dirname + '/views');
app.set('view engine','hbs');

/* Anulé este endpoint para dejar que la ruta raíz sea el home.hbs (handlebars)
app.get('/', (req,res) => {
    res.send('Desafío Clase 10 - HandleBars + Socket - Leandro Daniel Maximino 🔥🔥🔥🔥');
})
*/

app.use('/', home_router);
app.use('/realtimeproducts', views_router);
app.use('/api/products', products_router);
app.use('/api/carts', carts_router);

app.use(errorHandler);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀🚀🚀🚀`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log(`Usuario Conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Usuario Desconectado`);
    });

    socket.on('newProduct', async(objProd) => {
        const product = await productsManager.createProduct(objProd);
        if(product.msg) {
            socketServer.emit('productExist',product.msg);
            return;
        } 
        const products = await productsManager.getProducts();
        socketServer.emit('products', products);
    })
})
