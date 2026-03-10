const API_KEY = "ab4c94b96748068a8046128ef6c086e1";
const FEATCH_LIMIT = 5;

document.querySelector("#search").addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent reload page

  const cityName = document.querySelector("#city_name").value;

  // fetch API city data
  const fetchCity = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},BR&limit=${FEATCH_LIMIT}&appid=${API_KEY}`,
  );
  const cityJson = await fetchCity.json();
  console.log('cityJson: ', cityJson);

  if (fetchCity.status === 200) {
    const dataCity = {
      city: capitalizeFirstLetter(cityName),
      country: cityJson[0].country,
      lat: cityJson[0].lat,
      lon: cityJson[0].lon,
      state: cityJson[0].state,
    }
    showInfoCity(dataCity);
  } else {
    showAlert('Cidade não localizada...')
  }

  const fetchForecast = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityJson[0].lat}&lon=${cityJson[0].lon}&units=metric&lang=pt-br&appid=${API_KEY}`)

  const forecastJson = await fetchForecast.json();
  console.log('forecastJson: ', forecastJson);
  
  if (fetchForecast.status === 200) {
    showInfoForecast({
      temp: forecastJson.main.temp,
      tempDescription: forecastJson.weather[0].description,
      tempIcon: forecastJson.weather[0].icon,
      tempMax: forecastJson.main.temp_max,
      tempMin: forecastJson.main.temp_min,
      humidity: forecastJson.main.humidity,
      wind: forecastJson.wind.speed,
    });
  } else {
    showAlert('Não foi possível obter os dados...')
  }
});

function showInfoCity(data) {
  document.querySelector('#title').textContent = data.city;
}

function showInfoForecast(data) {
  showAlert('');

  document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/payload/api/media/file/${data.tempIcon}.png`)
  document.querySelector('#temp_value').innerHTML = 
    `
      ${(data.temp).toFixed(1).toString().replace('.', ',')} <sup>ºc</sup>
    `
  document.querySelector('#temp_description').textContent = data.tempDescription;
  document.querySelector('#temp_max').innerHTML = 
    `
      ${(data.tempMax).toFixed(1).toString().replace('.', ',')} <sup>ºc</sup>
    `
  document.querySelector('#temp_min').innerHTML = 
    `
      ${(data.tempMin).toFixed(1).toString().replace('.', ',')} <sup>ºc</sup>
    `
  document.querySelector('#humidity').innerHTML = 
    `
      ${Number(data.humidity)}%
    `
  document.querySelector('#wind').innerHTML = 
    `
      ${(data.wind).toFixed(1).toString().replace('.', ',')} km/h
    `
}

function showAlert(msg) {
  document.querySelector('#alert').textContent = msg
}

// Source - https://stackoverflow.com/a/1026087
// Posted by Steve Harrison, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-10, License - CC BY-SA 4.0
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
