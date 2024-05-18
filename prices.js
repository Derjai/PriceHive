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

async function getValues(values, titles, links, imgs) {
  var valuesText = await Promise.all(
    values.map(async (element) => {
      return await element.evaluate((node) => node.textContent.trim());
    })
  );

  // Get the text content of each element in the titles array
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

  // Get the text content of each element in the titles array
  var linksSrc = await Promise.all(
    links.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("href"));
    })
  );

  return [valuesText, titlesText, linksSrc, imgsSrc];
}

async function mercadoLibrePrices() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.mercadolibre.com.co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator(".nav-search-input");
  const searchButton = await page.locator(".nav-search-btn");
  await searchBar.fill("Samsung S20");
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

  [valuesText, titlesText, linksSrc, imgsSrc] = await getValues(
    values,
    titles,
    links,
    imgs
  );

  await browser.close();
  return toHTML(
    valuesText.slice(0, 3),
    titlesText.slice(0, 3),
    imgsSrc.slice(0, 3),
    linksSrc.slice(0, 3)
  );
}

async function olimpicaPrices() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.olimpica.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator('input[id^="downshift-"][id$="-input"]');
  await searchBar.fill("Samsung S20");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector(
    ".vtex-search-result-3-x-galleryItem.vtex-search-result-3-x-galleryItem--normal.vtex-search-result-3-x-galleryItem--grid-3"
  );

  var actualValueContainers = await page.$$(
    ".vtex-product-price-1-x-sellingPrice--hasListPrice--dynamicF"
  );

  var values = await actualValueContainers.map(async (container) => {
    return await container.$$(".olimpica-dinamic-flags-0-x-currencyInteger");
  });

  var titles = await page.$$(
    ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body"
  );
  var imgs = await page.$$(
    ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image vtex-product-summary-2-x-mainImageHovered"
  );
  var links = await page.$$(
    ".vtex-product-summary-2-x-clearLink vtex-product-summary-2-x-clearLink--product-summary h-100 flex flex-column"
  );

  console.log(actualValueContainers);
  //console.log(titles)
  //console.log(imgs)
  //console.log(links)

  //[valuesText,titlesText,linksSrc,imgsSrc] = await getValues(values,titles,imgs,links)

  //console.log(valuesText)

  await browser.close();
  // return toHTML(
  //   groupedValues.slice(0, 2),
  //   titlesText.slice(0, 2),
  //   imgsSrc.slice(0, 2),
  //   linksSrc.slice(0, 2)
  // );
}

async function alkostoPrices() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.alkosto.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#js-site-search-input");
  await searchBar.fill("Samsung S23");
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

  [valuesText, titlesText, linksSrc, imgsSrc] = await getValues(
    values,
    titles,
    links,
    imgs
  );

  linksSrc = linksSrc.map((src) => {
    return "https://www.alkosto.com" + src;
  });
  imgsSrc = imgsSrc.map((src) => {
    return "https://www.alkosto.com" + src;
  });

  console.log(imgsSrc);
  await browser.close();
  return toHTML(
    valuesText.slice(0, 2),
    titlesText.slice(0, 2),
    imgsSrc.slice(0, 2),
    linksSrc.slice(0, 2)
  );
}

async function exitoPrices() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.exito.com/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.$('[data-testid="store-input"]');
  await searchBar.fill("Samsung S20");
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded");

  await page.waitForSelector("p.ProductPrice_container__price__XmMWA");

  var values = await page.$$('p.ProductPrice_container__price__XmMWA')
  var titleLinks = await page.$$('a[data-testid="product-link"][title]')
  var imgs = await page.$$(".imagen_plp");

  var valuesText = await Promise.all(
    values.map(async (element) => {
      return await element.evaluate((node) => node.textContent.trim());
    })
  );

  var titlesText = await Promise.all(
    titleLinks.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute('title'));
    })
  );

  var imgsSrc = await Promise.all(
    imgs.map(async (element) => {
      return await element.evaluate((node) => node.getAttribute("src"));
    })
  );

  var linksSrc = await Promise.all(
    titleLinks.map(async (element) => {
      return await element.evaluate((node) => "https://www.exito.com"+node.getAttribute("href"));
    })
  );

  console.log(titlesText)

  await browser.close();
  return toHTML(
    valuesText.slice(0, 3),
    titlesText.slice(0, 3),
    imgsSrc.slice(0, 3),
    linksSrc.slice(0, 3)
  );
}

async function falabellaPrices() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.falabella.com.co/falabella-co/");
  await page.waitForLoadState("domcontentloaded");
  const searchBar = await page.locator("#testId-SearchBar-Input");
  await searchBar.fill("Samsung S20");
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
      return imgs
    }
  });


  [valuesText, titlesText, linksSrc, imgsSrc] = await getValues(
    values,
    titles,
    links,
    imgs
  );

  await browser.close();
  return toHTML(
    valuesText.slice(0, 3),
    titlesText.slice(0, 3),
    imgsSrc.slice(0, 3),
    linksSrc.slice(0, 3)
  );
}

module.exports = {
  mercadoLibrePrices,
  olimpicaPrices,
  falabellaPrices,
  exitoPrices,
  alkostoPrices,
};
