export default function Display({ nations }) {
  if (nations.length === 0) {
    return <div>{null}</div>;
  }

  if (nations.length === 1) {
    const countryName = nations[0].name.common;
    const capital = nations[0].capital[0];
    const area = nations[0].area;
    const languages = Object.values(nations[0].languages);
    const flag = nations[0].flags;

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

  if (nations.length <= 10) {
    const countryNames = nations.map((c) => c.name.common);
    return (
      <div>
        {countryNames.map((name) => (
          <div key={name}>{name}</div>
        ))}
      </div>
    );
  }

  return <div>Too many matches, specify another filter</div>;
}
