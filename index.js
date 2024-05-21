const {mercadoLibrePrices,
  olimpicaPrices,
  falabellaPrices,
  exitoPrices,
  alkostoPrices, toHTML} = require ("./prices.js")

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname,'assets')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
let searchResults={};
app.get('/search', async (req, res) => {
  try {
      const searchValue = req.query.search;
      const page = req.query.page || 1;
      const filter = req.query.filter;
      const itemsPerPage = 5;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      if (!searchResults[searchValue]) {
      const results = await Promise.all([
          mercadoLibrePrices(searchValue), 
          olimpicaPrices(searchValue), 
          alkostoPrices(searchValue), 
          exitoPrices(searchValue), 
          falabellaPrices(searchValue)
      ]);
      searchResults[searchValue] = results.flat();
      }

      let filteredResults = [...searchResults[searchValue]];
        if (filter === 'price') {
          filteredResults.sort((a, b) => a.price - b.price);
        }
      const productsForThisPage = filteredResults.slice(start, end);
      const html = toHTML(
        productsForThisPage.map((product) => product.price),
        productsForThisPage.map((product) => product.title),
        productsForThisPage.map((product) => product.img),
        productsForThisPage.map((product) => product.link)
    );
      
      const totalPages = Math.ceil(searchResults[searchValue].length / itemsPerPage);
      let pagination = '';
      for (let i = 1; i<=totalPages; i++) {
          pagination += `<a href="/search?search=${searchValue}&page=${i}">${i}</a>`;
      }
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
                          <button type="submit">Buscar</button>
                      </form>
                  </header>
                  <div class="display">
                      <a href="/search?search=${searchValue}&filter=price&page=${page}">Filtrar por precio</a>
                      <a href="/search?search=${searchValue}&page=${page}">Filtrar por tienda</a>
                      <div class="products">
                          <div id="placeholder" class="placeholder">
                              ${html}
                          </div>
                      </div>
                      <div class="pagination">${pagination}</div>
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
