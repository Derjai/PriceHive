import { chromium } from "playwright";

// TODO: Terminar de implementar las funciones y probarlas

async function mercadoLibrePrices(n){
    const browser = await chromium.launch({ headless: false });
    var vals = [];
    const page = await browser.newPage();
    await page.goto("https://www.mercadolibre.com.co/");
    await page.waitForLoadState("domcontentloaded");
    const searchBar = await page.locator(".nav-search-input");
    const searchButton = await page.locator(".nav-search-btn");
    await searchBar.fill("Samsung S20");
    await searchButton.click();
    await page.waitForLoadState("domcontentloaded");
    var values = await page.$$(".ui-search-price__second-line");
    values = values.slice(0,2*n)
    for (const val of values) {
        const price = await val.$(".andes-money-amount__fraction")
        vals.push(await price.textContent());
    }
    vals = vals.filter((_, index) => (index+1) % 2 !== 0);
    
    await browser.close();
    return vals
}

async function olimpicaPrices(){
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
    const buttons = await page.locator('.olimpica-pragma-0-x-orderByOptionItem');
    const priceButton = await buttons.filter(button => button.textContent() === 'Precios más bajo');
    await priceButton.click();
    await page.waitForLoadState("domcontentloaded");
    var values = await page.$$(".price");
    values = values.slice(0,3)
    for (const val of values) {
        vals.push(await val.textContent());
    }
    await browser.close();
    return vals
}

async function alkostoPrices(){
    const browser = await chromium.launch({ headless: false });
    var vals = [];
    const page = await browser.newPage();
    await page.goto("https://www.alkosto.com/");
    await page.waitForLoadState("domcontentloaded");
    const searchBar = await page.locator("#js-site-search-input");
    await searchBar.fill("Samsung S20");
    const searchButton = await page.locator(".ais-SearchBox-submit.js-algolia-search-button.btn");
    await searchButton.click();
    await page.waitForLoadState("domcontentloaded");
    var values = await page.$$(".price");
    values = values.slice(0,3)
    for (const val of values) {
        vals.push(await val.textContent());
    }
    await browser.close();
    return vals
}

async function exitoPrices(){
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
    values = values.slice(0,3)
    for (const val of values) {
        vals.push(await val.textContent());
    }
    await browser.close();
    return vals
}

async function falabellaPrices(){
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
    values = values.slice(0,3)
    for (const val of values) {
        vals.push(await val.textContent());
    }
    await browser.close();
    return vals
}

