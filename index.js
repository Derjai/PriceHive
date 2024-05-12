import {
    mercadoLibrePrices,
    olimpicaPrices,
    falabellaPrices,
    exitoPrices,
    alkostoPrices,
  } from "./assets/js/prices.js"

  const MLprices = await mercadoLibrePrices();

  class PriceList {
    constructor(prices) {
        this.prices = prices;
    }

    render() {
        const container = document.getElementById('MercadoLibrePrices');
        container.innerHTML = '';

        this.prices.forEach(price => {
            const card = document.createElement('div');
            card.classList.add('price-card');
            card.textContent = `$${price.toFixed(2)}`;
            container.appendChild(card);
        });
    }
}

const priceListComponent = new PriceList(MLprices);

priceListComponent.render()

