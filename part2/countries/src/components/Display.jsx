import Nation from "./Nation";

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
