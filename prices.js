const { chromium } = require("playwright");

function toHTML(prices, titles, imgs, links) {
  var html = "";
  for (var i = 0; i < titles.length; i++) {
    html += "<div class=card>";
    html += "<img src= " + imgs[i] + "></img>";
    html += "<h4>" + titles[i] + "</h4>";
    html += "<p>" + prices[i] + "</p>";
    html += "<a href = " + links[i] + "> Compra Aqui</a>";
    html += "</div>";
  }
  return html;
}

async function getOlimpicaValues(values, titles, links, imgs) {
  var valuesText = await Promise.all(
    values.map(async (element) => {
      const priceElements = await element.$$(
        ".olimpica-dinamic-flags-0-x-currencyInteger"
      );
      const priceParts = await Promise.all(
        priceElements.map((priceElement) =>
          priceElement.evaluate((el) => el.innerText)
        )
      );
      const price = priceParts.join("");
      return price;
    })
  );

  var titlesText = await Promise.all(
    titles.map(async (element) => {
      return await element.evaluate((node) => node.innerText.trim());
    })
  );

  var imgsSrc = await Promise.all(
    imgs.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("src"));
    })
  );

  var linksSrc = await Promise.all(
    links.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("href"));
    })
  );

  return [valuesText, titlesText, linksSrc, imgsSrc];
}

async function getValues(values, titles, links, imgs) {
  var valuesText = await Promise.all(
    values.map(async (element) => {
      return await element.evaluate((node) => node.textContent.trim());
    })
  );

  var titlesText = await Promise.all(
    titles.map(async (element) => {
      return await element.evaluate((node) => node.textContent.trim());
    })
  );

  var imgsSrc = await Promise.all(
    imgs.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("src"));
    })
  );

  var linksSrc = await Promise.all(
    links.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("href"));
    })
  );

  return [valuesText, titlesText, linksSrc, imgsSrc];
}

async function getCheapestProducts(
  values,
  titles,
  links,
  imgs,
  addStoreLink = true,
  addStoreImg = true,
  Store
) {
  values = values.slice(0, 5);
  titles = titles.slice(0, 5);
  links = links.slice(0, 5);
  imgs = imgs.slice(0, 5);

  if (Store === "https://www.olimpica.com/") {
    [valuesText, titlesText, linksSrc, imgsSrc] = await getOlimpicaValues(
      values,
      titles,
      links,
      imgs
    );
  } else {
    [valuesText, titlesText, linksSrc, imgsSrc] = await getValues(
      values,
      titles,
      links,
      imgs
    );
  }

  const products = valuesText.map((price, i) => ({
    title: titlesText[i],
    price: parseFloat(price.replace(/\./g, "").replace(/[^0-9.-]+/g, "")),
    link: addStoreLink ? Store + linksSrc[i] : linksSrc[i],
    img: addStoreImg ? Store + imgsSrc[i] : imgsSrc[i],
  }));
  products.sort((a, b) => a.price - b.price);
  const cheapestThreeProducts = products.slice(0, 3);
  return cheapestThreeProducts;
}

async function mercadoLibrePrices(Product) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.mercadolibre.com.co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator(".nav-search-input");
  const searchButton = await page.locator(".nav-search-btn");
  await searchBar.fill(Product);
  await searchButton.click();
  await page.waitForLoadState("domcontentloaded");
  const newItem = await page.$('[title="Nuevo"]');
  await newItem.click();
  await page.waitForLoadState("domcontentloaded");
  const filter = await page.locator(".andes-dropdown__trigger");
  await filter.click();
  await page.waitForLoadState("domcontentloaded");
  const leastPrice = await page.$('[data-key="price_asc"]');
  await leastPrice.click();
  await page.waitForLoadState("domcontentloaded");

  var values = await page.$$(".andes-money-amount__fraction");
  var titles = await page.$$(".ui-search-item__title");
  var imgs = await page.$$(".ui-search-result-image__element");
  var links = await page.$$(
    ".ui-search-item__group__element.ui-search-link__title-card.ui-search-link"
  );

  const cheapestProducts = await getCheapestProducts(
    values,
    titles,
    links,
    imgs,
    false,
    false,
    "https://www.mercadolibre.com.co/"
  );

  await browser.close();
  return cheapestProducts;
}

async function olimpicaPrices(Product) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.olimpica.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator('input[id^="downshift-"][id$="-input"]');
  await searchBar.fill(Product);
  await page.keyboard.press("Enter");
  await page.waitForSelector(
    ".vtex-product-price-1-x-sellingPrice--hasListPrice--dynamicF"
  );

  var values = await page.$$(
    ".vtex-product-price-1-x-sellingPrice--hasListPrice--dynamicF"
  );
  var titles = await page.$$(
    "span.vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
  );
  var links = await page.$$("span.vtex-product-summary-2-x-productBrand");
  var imgs = await page.$$(
    "img.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image.vtex-product-summary-2-x-mainImageHovered"
  );

  const cheapestProducts = await getCheapestProducts(
    values,
    titles,
    links,
    imgs,
    false,
    false,
    "https://www.olimpica.com/"
  );
  await browser.close();
  return cheapestProducts;
}

async function alkostoPrices(Product) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.alkosto.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#js-site-search-input");
  await searchBar.fill(Product);
  await searchBar.click();
  await page.press("#js-site-search-input", "Enter");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector(".js-product-item.js-algolia-product-click");

  titles = await page.$$(
    "h3.product__item__top__title.js-algolia-product-click.js-algolia-product-title"
  );
  values = await page.$$("span.price");
  links = await page.$$("a.js-view-details.js-algolia-product-click");
  imgs = await page.$$(
    ".product__item__information__image.js-algolia-product-click img"
  );

  const cheapestProducts = await getCheapestProducts(
    values,
    titles,
    links,
    imgs,
    true,
    true,
    "https://www.alkosto.com/"
  );

  await browser.close();
  return cheapestProducts;
}

async function exitoPrices(Product) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.exito.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.$('[data-testid="store-input"]');
  await searchBar.fill(Product);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector("p.ProductPrice_container__price__XmMWA");

  var values = await page.$$("p.ProductPrice_container__price__XmMWA");
  var titleLinks = await page.$$('a[data-testid="product-link"][title]');
  var imgs = await page.$$(".imagen_plp");

  const cheapestProducts = await getCheapestProducts(
    values,
    titleLinks,
    titleLinks,
    imgs,
    true,
    false,
    "https://www.exito.com/"
  );

  await browser.close();
  return cheapestProducts;
}

async function falabellaPrices(Product) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.falabella.com.co/falabella-co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#testId-SearchBar-Input");
  await searchBar.fill(Product);
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector(".pod-subTitle.subTitle-rebrand");

  var titles = await page.$$(".pod-subTitle.subTitle-rebrand");
  var values = await page.$$(
    ".copy10.primary.medium.jsx-3451706699.normal.line-height-22"
  );
  var links = await page.$$(
    "a.jsx-2481219049.jsx-2056183481.pod.pod-4_GRID.pod-link"
  );
  var imgs = await page.$$('section.jsx-2469003054 picture > img[width="240"]');

  imgs = await imgs.filter(async (img) => {
    if (await img.isVisible()) {
      return imgs;
    }
  });

  const cheapestProducts = await getCheapestProducts(
    values,
    titles,
    links,
    imgs,
    false,
    false,
    "https://www.falabella.com.co/falabella-co/"
  );

  await browser.close();
  return cheapestProducts;
}


module.exports = {
  mercadoLibrePrices,
  olimpicaPrices,
  falabellaPrices,
  exitoPrices,
  alkostoPrices,
  toHTML
};
