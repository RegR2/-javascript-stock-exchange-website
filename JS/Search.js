class Search {
  constructor(element) {
    this.element = element;
    this.spinner = document.getElementById("spinner");
  }

  appendElementOnSearch(callBack) {
    spinner.style.visibility = "hidden";
    const searchForm = document.createElement(`input`);
    searchForm.classList.add("search-form");
    searchForm.type = `search`;
    searchForm.placeholder = `Search The Stock Exchange`;
    this.element.appendChild(searchForm);

    const comparisonDirectory = document.createElement(`a`);
    comparisonDirectory.classList.add(`comparison-directory`);
    comparisonDirectory.innerHTML = `<a href=#>
        Compare Companies
        </a>`;
    document.getElementById(`directoryWrapper`).append(comparisonDirectory);
    comparisonDirectory.style.visibility = `hidden`;
    this.init(searchForm, callBack, comparisonDirectory);
  }

  init(searchForm, callBack, comparisonDirectory) {
    const processDebounce = debounce(() => {
      if (searchForm.value === ``) {
        return (document.getElementById(`resultsWrapper`).innerHTML = ``);
      } else {
        this.getStocks(searchForm, callBack, comparisonDirectory);
      }
    });
    searchForm.addEventListener("input", processDebounce);

    function debounce(func, timeout = 800) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    }
  }

  async getStocks(searchForm, callBack, comparisonDirectory) {
    const inputValue = searchForm.value;
    const resultsWrapper = document.getElementById("resultsWrapper");
    resultsWrapper.innerHTML = "";
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${inputValue}&limit=10&exchange=NASDAQ`;

    try {
      const response = await fetch(url);
      this.spinner.style.visibility = "visible";
      const companyData = await response.json();
      this.getAdditionalData(
        companyData,
        inputValue,
        callBack,
        comparisonDirectory
      );
    } catch (error) {
      console.log("Something went wrong!");
    } finally {
      this.spinner.style.visibility = "hidden";
    }
  }

  async getAdditionalData(
    companyData,
    inputValue,
    callBack,
    comparisonDirectory
  ) {
    companyData.forEach(async (i) => {
      try {
        const urlAddition = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/profile/${i.symbol}`;
        const serverResponse = await fetch(`${urlAddition}`);
        const serverData = await serverResponse.json();
        this.spinner.style.visibility = "hidden";
        callBack(serverData, inputValue, comparisonDirectory);
      } catch (error) {
        console.log("Something went wrong");
      } finally {
        this.spinner.style.visibility = "hidden";
      }
    });
  }
}
