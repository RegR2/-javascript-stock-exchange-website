class Marquee {
  constructor(element) {
    this.element = element;
    this.url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com//api/v3/quotes/nyse`;
  }

  async fetchMarqueeData() {
    const marqueeResults = await fetch(`${this.url}`);
    const marqueeData = await marqueeResults.json();
    this.appendMarqueeData(marqueeData);
  }

  appendMarqueeData(marqueeData) {
    marqueeData.splice(50);
    marqueeData.forEach((company) => {
      const marqueeCompany = document.createElement("span");
      marqueeCompany.classList.add("marquee-company");
      marqueeCompany.innerText = `${company.symbol}`;
      this.element.append(marqueeCompany);

      const marqueePrice = document.createElement("span");
      marqueePrice.classList.add("marquee-price");
      marqueePrice.innerText = `(${company.price.toFixed(2)})`;

      if (company.price >= 0) {
        marqueePrice.classList.add("text-success");
      } else {
        marqueePrice.classList.add("text-danger");
      }
      this.element.append(marqueePrice);
    });
  }
}
