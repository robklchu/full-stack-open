import { useState, useEffect } from "react";
import axios from "axios";

function Nation({ nation }) {
  const [weather, setWeather] = useState(null);

  function fetchWeather(url) {
    axios
      .get(url)
      .then((response) => response.data)
      .then((weather) => setWeather(weather));
  }

  const countryName = nation.name.common;
  const capital = nation.capital[0];
  const area = nation.area;
  const languages = Object.values(nation.languages);
  const flag = nation.flags;
  let temperature, windSpeed, weatherDesc, weatherIcon, weatherIconUrl;

  const apiKey = import.meta.env.VITE_OPEN_WEATHER;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;

  useEffect(() => fetchWeather(weatherUrl), []);

  console.log("weather", weather);

  if (weather) {
    temperature = weather.main.temp;
    windSpeed = weather.wind.speed;
    weatherDesc = weather.weather[0].description;
    weatherIcon = weather.weather[0].icon;
    weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  }

  return (
    <>
      {weather && (
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
          <h2>Weather in {capital}</h2>
          <div>Temperature {temperature} Celsius</div>
          <img src={weatherIconUrl} alt={weatherDesc} />
          <div>Wind {windSpeed} m/s</div>
        </div>
      )}
    </>
  );
}

export default Nation;
