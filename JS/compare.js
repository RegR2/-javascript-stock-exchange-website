class Compare {
  constructor(compareElement) {
    this.compareElement = compareElement;
  }

  fetchCompanyComparison() {
    spinner.style.visibility = "hidden";
    const symbols = new URLSearchParams(window.location.search).get("symbol");
    this.symbolsArray = symbols.split(",");
    console.log(this.symbolsArray);

    this.symbolsArray.forEach(async (symbol) => {
      const urlCompare = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;
      spinner.style.visibility = "visible";
      const responseCompare = await fetch(`${urlCompare}`);
      const dataCompare = await responseCompare.json();
      console.log(dataCompare.profile);

      const comparisonWrapper = document.createElement(`div`);
      comparisonWrapper.classList.add(`comparison-wrapper`);
      this.compareElement.append(comparisonWrapper);

      const comparisonHeader = document.createElement(`div`);
      comparisonHeader.classList.add(`comparisonHeader`);
      comparisonWrapper.append(comparisonHeader);

      const comparisonProfile = document.createElement(`div`);
      comparisonProfile.classList.add(`comparison-profile`);
      comparisonHeader.append(comparisonProfile);

      const comparisonInfo = document.createElement(`div`);
      comparisonInfo.classList.add(`comparison-info`);
      comparisonHeader.appendChild(comparisonInfo);

      const nameSymbol = document.createElement(`div`);
      nameSymbol.classList.add(`name-symbol`);
      comparisonProfile.append(nameSymbol);

      const comparisonBody = document.createElement(`div`);
      comparisonBody.classList.add(`comparison-body`);
      comparisonWrapper.append(comparisonBody);

      const bioWrapper = document.createElement(`div`);
      bioWrapper.classList.add(`bio-wrapper`);
      comparisonBody.append(bioWrapper);

      const chartWrapper = document.createElement(`div`);
      chartWrapper.classList.add(`chart-wrapper`);
      comparisonWrapper.append(chartWrapper);

      const comparisonName = document.createElement(`a`);
      comparisonName.classList.add("comparison-name");
      comparisonName.innerHTML =
        `<a href=${dataCompare.profile.website}>` +
        `${dataCompare.profile.companyName} ` +
        `</a>`;
      nameSymbol.append(comparisonName);

      const comparisonSymbol = document.createElement(`span`);
      comparisonSymbol.classList.add(`comparison-symbol`);
      comparisonSymbol.innerText = `(${dataCompare.symbol})`;
      nameSymbol.append(comparisonSymbol);

      const comparisonImg = document.createElement(`img`);
      comparisonImg.classList.add(`comparison-img`);
      comparisonImg.onerror = function () {
        comparisonImg.src = "./Images/placeholder-image.png";
      };
      comparisonImg.src = `${dataCompare.profile.image}`;
      nameSymbol.prepend(comparisonImg);

      const comparisonPrice = document.createElement(`span`);
      comparisonPrice.classList.add(`comparison-price`);
      comparisonPrice.innerText = `Price: ${dataCompare.profile.price} `;
      comparisonInfo.append(comparisonPrice);

      const comparisonPercentage = document.createElement(`span`);
      comparisonPercentage.classList.add(`comparison-percentage`);

      if (dataCompare.profile.changes >= 0) {
        comparisonPercentage.innerText =
          `(` + `+${dataCompare.profile.changes.toFixed(2)}%` + `)`;
        comparisonPercentage.classList.add("text-success");
      } else {
        comparisonPercentage.innerText =
          `(` + `${dataCompare.profile.changes.toFixed(2)}%` + `)`;
        comparisonPercentage.classList.add("text-danger");
      }
      comparisonInfo.append(comparisonPercentage);

      const comparisonBio = document.createElement(`span`);
      comparisonBio.classList.add(`comparison-bio`);
      comparisonBio.innerText = `${dataCompare.profile.description}`;
      bioWrapper.append(comparisonBio);

      this.chartCanvas = document.createElement(`canvas`);
      this.chartCanvas.classList.add(`chart-canvas`);
      this.chartCanvas.setAttribute(`id`, `chart-${symbol}`);
      chartWrapper.append(this.chartCanvas);
      console.log(this.chartCanvas);

      this.addComparisonCharts(symbol);
    });
  }

  async addComparisonCharts(symbol) {
    console.log(symbol);
    const urlCharts = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
    const responseCharts = await fetch(`${urlCharts}`);
    const dataCharts = await responseCharts.json();
    spinner.style.visibility = "hidden";
    const stocksHistory = dataCharts.historical;

    const history = stocksHistory.splice(0, 30);
    const historicalLabels = [];
    const historicalStock = [];
    console.log(historicalStock);
    console.log(historicalLabels);

    for (const date of history) {
      historicalLabels.push(date.date);
      historicalStock.push(date.close);
    }
    this.comparisonChangeChart(historicalStock, historicalLabels, symbol);
  }

  comparisonChangeChart(historicalStock, historicalLabels, symbol) {
    const chartID = document.getElementById(`chart-${symbol}`);
    const comparisonCtx = chartID.getContext("2d");
    const comparisonStockChart = new Chart(comparisonCtx, {
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
