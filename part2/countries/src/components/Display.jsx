function Nation({ nation }) {
  const countryName = nation.name.common;
  const capital = nation.capital[0];
  const area = nation.area;
  const languages = Object.values(nation.languages);
  const flag = nation.flags;

  return (
    <div>
      <h1>{countryName}</h1>
      <div>Capital {capital}</div>
      <div>Area {area}</div>
      <h2>Languages</h2>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={flag.png} alt={flag.alt} />
    </div>
  );
}

function Display({ nations, onShowBtnClick, showBtnStatus, selectedCountry }) {
  if (nations.length === 0) {
    return <div>{null}</div>;
  }

  if (nations.length === 1) {
    return <Nation nation={nations[0]} />;
  }

  if (nations.length <= 10) {
    const countryNames = nations.map((c) => c.name.common);
    return (
      <div>
        {!showBtnStatus &&
          countryNames.map((name) => (
            <div key={name}>
              {name}{" "}
              <button
                onClick={() =>
                  onShowBtnClick(nations.find((c) => c.name.common === name))
                }
              >
                Show
              </button>
            </div>
          ))}
        {showBtnStatus && <Nation nation={selectedCountry} />}
      </div>
    );
  }

  return <div>Too many matches, specify another filter</div>;
}

export default Display;
