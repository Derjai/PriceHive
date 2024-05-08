import { chromium } from "playwright";

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

async function amazonPrices(n){
    const browser = await chromium.launch({ headless: false });
    var vals = [];
    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/");
    await page.waitForLoadState("domcontentloaded");
    const searchBar = await page.locator(".nav-input nav-progressive-attribute");
    const searchButton = await page.locator(".nav-search-submit nav-sprite");
    await searchBar.fill("Samsung S20");
    await searchButton.click();

    await page.waitForLoadState("domcontentloaded");

}

amazonPrices(20)