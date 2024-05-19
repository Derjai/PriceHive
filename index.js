const {
  mercadoLibrePrices,
  olimpicaPrices,
  falabellaPrices,
  exitoPrices,
  alkostoPrices,
} = require("./prices.js");

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, "assets")));

app.get("/", async (req, res) => {
  try {

    var allresults = [];

    let page = parseInt(req.query.page) || 1;

    async function performSearch(search) {
        const MLResults = await mercadoLibrePrices(search);
        console.log("Mercado Libre Listo")
        const OResults = await olimpicaPrices(search);
        console.log("Olimpica Listo")
        const AResults = await alkostoPrices(search);
        console.log("Alkosto Listo")
        const EResults = await exitoPrices(search);
        console.log("Exito Listo")
        const FResults = await falabellaPrices(search);
        console.log("Falabella Listo")
        return (MLResults+OResults+AResults+EResults+FResults).split("</div>");
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
                    <div class="searchbar">
                        <input type="search" name="search" id="search" placeholder="Buscar productos">
                        <button type="submit" 
                        onClick = ${allresults = await performSearch("samsung S20")}>Buscar</button>
                    </div>
                </header>
                <div class="display">
                    <button id="filterPrice">Filtrar por precio</button>
                    <button id="filterStore">Filtrar por tienda</button>
                    <div class="products">
                        <div id="placeholder" class="placeholder">
                        ${
                          allresults == []
                            ? allresults.slice((page-1)*3,page*3-1)
                            : "<p>No se han encontrado resultados</p>"
                        }
                        </div>
                    </div>
                    <div class="pagination">
                    ${
                      page > 1
                        ? `<button class="pagButton" onclick="window.location.href='/?page=${
                            page - 1
                          }'">Previous</button>`
                        : ""
                    }
                    <span>
                        Current Page: ${page}
                    </span>
                    ${
                      page < 3
                        ? `<button class="pagButton" onclick="window.location.href='/?page=${
                            page + 1
                          }'">Next</button>`
                        : ""
                    }
                </div>               
            </div>
            <script type="module" src="/index.js"></script>
        </body>
        </html>
        `);
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Error occurred while scraping.", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
