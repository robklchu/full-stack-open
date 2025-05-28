import { useState, useEffect } from "react";
import axios from "axios";
import Display from "./components/Display";

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState(null);
  const [showBtnClicked, setShowBtnClicked] = useState(false);
  const [countryToShow, setCountryToShow] = useState(null);

  let matchedCountries;

  function clickShowBtnHandler(country) {
    setShowBtnClicked(true);
    setCountryToShow(country);
  }

  function changeHandler(event) {
    setQuery(event.target.value);
    setShowBtnClicked(false);
  }

  function fetchCountries() {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => response.data)
      .then((countries) => setCountries(countries));
  }

  useEffect(fetchCountries, []);

  if (countries !== null) {
    if (query.length === 0) {
      matchedCountries = [];
    } else {
      matchedCountries = countries.filter((c) =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  return (
    <div>
      find countries <input onChange={changeHandler} value={query} />
      {countries && (
        <Display
          nations={matchedCountries}
          onShowBtnClick={clickShowBtnHandler}
          showBtnStatus={showBtnClicked}
          selectedCountry={countryToShow}
        />
      )}
    </div>
  );
}

export default App;
