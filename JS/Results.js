class Results {
  constructor(resultsElement) {
    this.resultsElement = resultsElement;
    this.chosenSymbols = [];
    console.log(this.chosenSymbols);
  }

  async appendResults(serverData, inputValue, comparisonDirectory) {
    console.log(comparisonDirectory);
    await serverData.forEach((data) => {
      const results = document.createElement(`div`);
      results.classList.add(`results`);
      this.resultsElement.appendChild(results);

      const resultItemWrapper = document.createElement(`div`);
      resultItemWrapper.classList.add(`result-item-wrapper`);
      results.appendChild(resultItemWrapper);

      const resultsName = document.createElement(`span`);
      resultsName.classList.add(`results-name`);
      resultsName.innerHTML = ` <a href=/company.html?symbol=${data.symbol}>
        ${data.companyName}</a>`;
      resultItemWrapper.appendChild(resultsName);

      const resultsSymbol = document.createElement(`span`);
      resultsSymbol.classList.add(`results-symbol`);
      resultsSymbol.innerText = ` (${data.symbol})`;
      resultItemWrapper.appendChild(resultsSymbol);

      const companyIcon = document.createElement(`img`);
      companyIcon.classList.add("company-icon");
      companyIcon.onerror = function () {
        this.src = "./Images/placeholder-image.png";
      };
      companyIcon.src = `${data.image} `;
      resultItemWrapper.prepend(companyIcon);

      const priceChanges = document.createElement("span");
      priceChanges.classList.add("price-changes");

      if (data.changes >= 0) {
        priceChanges.innerText = ` (+${data.changes.toFixed(2)}` + `%)`;
        priceChanges.classList.add("text-success");
      } else {
        priceChanges.innerText = ` (${data.changes.toFixed(2)}` + `%)`;
        priceChanges.classList.add("text-danger");
      }
      resultItemWrapper.appendChild(priceChanges);

      const compareButton = document.createElement(`button`);
      compareButton.classList.add(`compare-button`);
      compareButton.innerHTML = `Compare`;
      results.appendChild(compareButton);

      this.highlight(
        resultsName,
        resultsSymbol,
        inputValue,
        compareButton,
        data,
        comparisonDirectory
      );
    });
  }

  highlight(
    resultsName,
    resultsSymbol,
    inputValue,
    compareButton,
    data,
    comparisonDirectory
  ) {
    const resultItem = new RegExp(inputValue, `gi`);
    const highlight = resultsName.innerText;
    const highlightedItem = highlight.replace(
      resultItem,
      `<mark class="p-0 bg-warning">$&</mark>`
    );
    resultsName.innerHTML =
      ` <a href=/company.html?symbol=${data.symbol}>` +
      highlightedItem +
      `</a>`;

    const inputValueItem = new RegExp(inputValue, `gi`);
    const unMarkedSymbol = resultsSymbol.innerText;
    const highlightedSymbol = unMarkedSymbol.replace(
      inputValueItem,
      `<mark class="p-0 bg-warning">$&</mark>`
    );
    resultsSymbol.innerHTML = highlightedSymbol;

    this.activateCompareButton(compareButton, data, comparisonDirectory);
  }

  activateCompareButton(compareButton, data, comparisonDirectory) {
    const runCompareData = () => {
      document.getElementById(`buttonsWrapper`).appendChild(companyButton);
      this.chosenSymbols.push(data.symbol);
      if (this.chosenSymbols.length > 3) {
        alert`Please choose up to 3 companies`;
      }
      if (this.chosenSymbols.length > 3) {
        alert`Please choose up to 3 companies`;
      }
      comparisonDirectory.style.visibility = `visible`;
      comparisonDirectory.innerHTML = `<a href=/compare.html?symbol=${this.chosenSymbols}>
        Compare Companies
        </a>`;
    };

    compareButton.addEventListener(`click`, runCompareData);
    this.runCompareData = runCompareData.bind(this);

    const companyButton = document.createElement("button");
    companyButton.classList.add("company-button");
    companyButton.innerHTML = `${data.symbol}   x`;

    this.closeCompareButton(companyButton, data);
  }

  closeCompareButton(companyButton, data) {
    companyButton.addEventListener(`click`, () => {
      companyButton.parentNode.removeChild(companyButton);
      this.chosenSymbols.splice(this.chosenSymbols.indexOf(data.symbol), 1);
      console.log(this.chosenSymbols);
    });
  }
}
