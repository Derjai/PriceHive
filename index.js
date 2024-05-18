const {mercadoLibrePrices,
    olimpicaPrices,
    falabellaPrices,
    exitoPrices,
    alkostoPrices} = require ("./prices.js")

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', async (req, res) => {
    try {
        //const MLResults = await mercadoLibrePrices();
        //const OResults = await olimpicaPrices();
        //const AResults = await alkostoPrices();
        const EResults = await exitoPrices();
        //const FResults = await falabellaPrices();

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Price Hive</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <div id="app">
                <header>
                    <div class = "logo">
                        <img src="utils/Logo.svg" alt="Logo" width="100" height="100">
                        <h1>Price Hive</h1>    
                    </div>
                    <form action ="/search" method="GET">
                        <input type="search" name="search" id="search" placeholder="Buscar productos">
                        <button type="submit" onClick = {}>Buscar</button>
                    </form>
                </header>
                <div class="display">
                    <button id="filterPrice">Filtrar por precio</button>
                    <button id="filterStore">Filtrar por tienda</button>
                    <div class="products">
                        <div id="placeholder" class="placeholder">
                            ${EResults}
                        </div>
                    </div>
                    <div class="pagination"></div>
                </div>
            </div>
            <script type="module" src="/index.js"></script>
        </body>
        </html>
        `);
    } catch (error) {
        res.status(500).send({msg: 'Error occurred while scraping.', error: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});