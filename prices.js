const { chromium } = require('playwright');

async function mercadoLibrePrices() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.mercadolibre.com.co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator(".nav-search-input");
  const searchButton = await page.locator(".nav-search-btn");
  await searchBar.fill("Samsung S20");
  await searchButton.click();
  await page.waitForLoadState("domcontentloaded");
  const newItem = await page.$('[title="Nuevo"]')
  await newItem.click()
  await page.waitForLoadState("domcontentloaded");
  const filter = await page.locator(".andes-dropdown__trigger")
  await filter.click()
  await page.waitForLoadState("domcontentloaded");
  const leastPrice = await page.$('[data-key="price_asc"]')
  await leastPrice.click()
  await page.waitForLoadState("domcontentloaded");
  var values = await page.$$(".andes-money-amount__fraction");
  var titles = await page.$$(".ui-search-item__title")
  var imgs = await page.$$(".ui-search-result-image__element")
  var links = await page.$$(".ui-search-item__group__element.ui-search-link__title-card.ui-search-link")
// Get the text content of each element in the values array
var valuesText = await Promise.all(values.map(async element => {
  return await element.evaluate(node => node.textContent.trim());
}));

// Get the text content of each element in the titles array
var titlesText = await Promise.all(titles.map(async element => {
  return await element.evaluate(node => node.textContent.trim());
}));

var imgsSrc = await Promise.all(imgs.map(async element => {
  return await element.evaluate(node => node.getAttribute("src"));
}));

// Get the text content of each element in the titles array
var linksSrc = await Promise.all(links.map(async element => {
  return await element.evaluate(node => node.getAttribute("href"));
}));
var html = "";
  for (var i = 0; i < titlesText.length; i++) {
      html += '<div class=card>';
      html += "<img src= "+imgsSrc[i]+"></img>"
      html += "<h4>" + titlesText[i] + "</h4>";
      html += "<p>" + valuesText[i] + "</p>";
      html += "<a href = "+linksSrc[i]+"> Compra Aqui</a>";
      html += "</div>";
  }
  await browser.close()
  return html;
}

async function olimpicaPrices() {
  const browser = await chromium.launch({ headless: false });
  var vals = [];
  const page = await browser.newPage();
  await page.goto("https://www.olimpica.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator('input[id^="downshift-"][id$="-input"]');
  await searchBar.fill("Samsung S20");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");
  const orderButton = await page.locator(".olimpica-pragma-0-x-orderByButton");
  await orderButton.click();
  await page.waitForLoadState("domcontentloaded");
  const buttons = await page.locator(".olimpica-pragma-0-x-orderByOptionItem");
  const priceButton = await buttons.filter(
    (button) => button.textContent() === "Precios más bajo"
  );
  await priceButton.click();
  await page.waitForLoadState("domcontentloaded");
  var values = await page.$$(".price");
  values = values.slice(0, 3);
  for (const val of values) {
    vals.push(await val.textContent());
  }
  await browser.close();
  return vals;
}

async function alkostoPrices() {
  const browser = await chromium.launch({ headless: false });
  var vals = [];
  const page = await browser.newPage();
  await page.goto("https://www.alkosto.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#js-site-search-input");
  await searchBar.fill("Samsung S20");
  const searchButton = await page.locator(
    ".ais-SearchBox-submit.js-algolia-search-button.btn"
  );
  await searchButton.click();
  await page.waitForLoadState("domcontentloaded");
  var values = await page.$$(".price");
  values = values.slice(0, 3);
  for (const val of values) {
    vals.push(await val.textContent());
  }
  await browser.close();
  return vals;
}

async function exitoPrices() {
  const browser = await chromium.launch({ headless: false });
  var vals = [];
  const page = await browser.newPage();
  await page.goto("https://www.exito.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator('input[data-testid="store-input"]');
  await searchBar.fill("Samsung S20");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");
  var values = await page.$$(".price");
  values = values.slice(0, 3);
  for (const val of values) {
    vals.push(await val.textContent());
  }
  await browser.close();
  return vals;
}

async function falabellaPrices() {
  const browser = await chromium.launch({ headless: false });
  var vals = [];
  const page = await browser.newPage();
  await page.goto("https://www.falabella.com.co/falabella-co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#testId-SearchBar-Input");
  await searchBar.fill("Samsung S20");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");
  var values = await page.$$(".cmr-cm-price__value");
  values = values.slice(0, 3);
  for (const val of values) {
    vals.push(await val.textContent());
  }
  await browser.close();
  return vals;
}

module.exports = {
    mercadoLibrePrices,
    olimpicaPrices,
    falabellaPrices,
    exitoPrices,
    alkostoPrices,
  };