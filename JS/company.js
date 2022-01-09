class CompanyInfo {
  constructor(companyElement, companySymbol) {
    this.companyElement = companyElement;
    this.companySymbol = companySymbol;
  }

  appendElementsCompany() {
    spinner.style.visibility = "hidden";

    this.companyWrapper = document.createElement(`div`);
    this.companyWrapper.classList.add("company-wrapper");
    this.companyElement.append(this.companyWrapper);

    this.companyContainer = document.createElement(`div`);
    this.companyContainer.classList.add("company-container");
    this.companyWrapper.append(this.companyContainer);

    this.companyHeader = document.createElement(`div`);
    this.companyHeader.classList.add(`company-header`);
    this.companyWrapper.append(this.companyHeader);

    this.companyBody = document.createElement(`div`);
    this.companyBody.classList.add(`company-body`);
    this.companyWrapper.append(this.companyBody);

    this.companyProfile = document.createElement(`div`);
    this.companyProfile.classList.add(`company-profile`);
    this.companyHeader.appendChild(this.companyProfile);

    this.companyInfo = document.createElement(`div`);
    this.companyInfo.classList.add(`company-info`);
    this.companyHeader.appendChild(this.companyInfo);

    this.nameSymbol = document.createElement(`div`);
    this.nameSymbol.classList.add(`name-symbol`);
    this.companyProfile.append(this.nameSymbol);

    this.companyBio = document.createElement(`div`);
    this.companyBio.classList.add(`company-bio`);
    this.companyBody.append(this.companyBio);

    this.chartWrapper = document.createElement(`div`);
    this.chartWrapper.classList.add(`chart-wrapper`);
    this.companyBody.append(this.chartWrapper);

    this.chartCanvas = document.createElement(`canvas`);
    this.chartCanvas.classList.add(`canvas`);
    this.chartCanvas.width = 500;
    this.chartCanvas.height = 300;
    this.chartWrapper.append(this.chartCanvas);

    this.websiteContainer = document.createElement(`div`);
    this.websiteContainer.classList.add(`website-container`);
    this.chartWrapper.append(this.websiteContainer);

    this.fetchCompanyInfo();
  }

  async fetchCompanyInfo() {
    const urlCompany = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.companySymbol}`;
    spinner.style.visibility = "visible";
    const responseCompany = await fetch(`${urlCompany}`);
    const dataCompany = await responseCompany.json();
    this.displayCompanyInfo(dataCompany);
  }

  displayCompanyInfo(dataCompany) {
    const companyName = document.createElement("span");
    companyName.classList.add("company-name");
    companyName.innerText = `${dataCompany.profile.companyName}`;
    this.nameSymbol.appendChild(companyName);

    const companyImg = document.createElement("img");
    companyImg.classList.add("company-img");
    companyImg.onerror = function () {
      this.src = "./Images/placeholder-image.png";
    };
    companyImg.src = `${dataCompany.profile.image}`;
    this.nameSymbol.prepend(companyImg);

    const nasdaq = document.createElement("span");
    nasdaq.classList.add("nasdaq");
    nasdaq.innerText = `(${dataCompany.symbol})`;
    this.nameSymbol.appendChild(nasdaq);

    const companyWebsite = document.createElement("span");
    companyWebsite.classList.add("company-website");
    companyWebsite.innerHTML =
      `<a href=` +
      `${dataCompany.profile.website}>` +
      `${dataCompany.profile.website}` +
      `</a>`;
    this.websiteContainer.appendChild(companyWebsite);

    const companyPrice = document.createElement("span");
    companyPrice.classList.add("company-price");
    companyPrice.innerText = `${dataCompany.profile.price.toFixed(2)} `;
    this.companyInfo.appendChild(companyPrice);

    const companyStockChange = document.createElement("span");
    companyStockChange.classList.add("stock-change");

    if (dataCompany.profile.changes >= 0) {
      companyStockChange.innerText =
        `(` + `+${dataCompany.profile.changes.toFixed(2)}%` + `)`;
      companyStockChange.classList.add("text-success");
    } else {
      companyStockChange.innerText =
        `(` + `${dataCompany.profile.changes.toFixed(2)}%` + `)`;
      companyStockChange.classList.add("text-danger");
    }
    this.companyInfo.appendChild(companyStockChange);

    const companyBio = document.getElementById("companyBio");
    const companyDescription = document.createElement("span");
    companyDescription.classList.add("company-description");
    companyDescription.innerText = `${dataCompany.profile.description}`;
    this.companyBio.appendChild(companyDescription);
  }

  async addChart() {
    const urlStockHistory = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.companySymbol}?serietype=line`;
    const historyResponse = await fetch(`${urlStockHistory}`);
    const historyData = await historyResponse.json();
    spinner.style.visibility = "hidden";
    const stocksHistory = historyData.historical;

    const history = stocksHistory.splice(0, 30);
    const historicalLabels = [];
    const historicalStock = [];

    for (const date of history) {
      historicalLabels.push(date.date);
      historicalStock.push(date.close);
    }
    this.stockChangeChart(historicalStock, historicalLabels);
  }

  stockChangeChart(historicalStock, historicalLabels) {
    const ctx = this.chartCanvas.getContext("2d");
    const monthlyStockChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: historicalLabels.reverse(),
        datasets: [
          {
            label: "Daily Stock Price History",
            data: historicalStock.reverse(),
            fill: true,
            backgroundColor: [`rgba(255, 152, 0, 0.2)`],
            borderColor: ["rgba(229, 136, 0, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });
  }
}
