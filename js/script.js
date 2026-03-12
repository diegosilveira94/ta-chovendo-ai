const API_KEY = "ab4c94b96748068a8046128ef6c086e1";
const FEATCH_LIMIT = 5;

document.querySelector("#search").addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent reload page

  const city = document.querySelector("#city_name").value;

  const dataCity = await fetchCity(city)
  console.log('DATACITY: ', dataCity);
  if (!dataCity) {
    showAlert('Cidade não encontrada!')
    removeWeather();
  }
  else {
    const forecast = await fetchForecast(dataCity)
    console.log('FORECAST: ', forecast);
    await showInfoForecast(forecast);
  }  
});

// fetch api city geo
async function fetchCity(city) {
  const apiUrlCity = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURI(city)},BR&limit=${FEATCH_LIMIT}&appid=${API_KEY}`

  try {
    const response = await fetch(apiUrlCity)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    console.log('CITYJSON: ', json);
    
    return {
      name: city,
      country: json[0].country,
      lat: json[0].lat,
      lon: json[0].lon,
      state: json[0].state,
    }
    
  } catch (error) {
    console.error('ERROR: ', error);
    
  }
}

// fetch api forecast
async function fetchForecast(data) {
  const apiUrlForecast = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&units=metric&lang=pt_br&appid=${API_KEY}`

  try {
    const response = await fetch(apiUrlForecast)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    console.log('JSON FORECAST: ', json);
    
    return {
      city: data.name,
      temp: json.main.temp,
      tempDescription: json.weather[0].description,
      tempIcon: json.weather[0].icon,
      tempMax: json.main.temp_max,
      tempMin: json.main.temp_min,
      humidity: json.main.humidity,
      wind: json.wind.speed,
    }
  } catch (error) {
    console.error('ERROR: ', error);
  }
}

// show infos dom elements
async function showInfoForecast(data) {
  // remove alert and show weather
  document.querySelector('#alert').classList.remove('show')
  document.querySelector('#weather').classList.add('show');

  document.querySelector('#title').textContent = data.city;

  const apiUrlIcon = await `https://openweathermap.org/payload/api/media/file/${data.tempIcon}.png`
  document.querySelector('#temp_img').setAttribute('src', apiUrlIcon)
  document.querySelector('#temp_value').innerHTML = formatterNumber(data.temp, '<sup>ºc</sup>')
  document.querySelector('#temp_description').textContent = data.tempDescription;
  document.querySelector('#temp_max').innerHTML = formatterNumber(data.tempMax, '<sup>ºc</sup>')
  document.querySelector('#temp_min').innerHTML = formatterNumber(data.tempMin, '<sup>ºc</sup>')
  document.querySelector('#humidity').innerHTML = formatterNumber(data.humidity, '%')
  document.querySelector('#wind').innerHTML = formatterNumber(data.wind, 'km/h')
}

function showAlert(msg) {
  document.querySelector('#alert p').innerHTML = msg
  document.querySelector('#alert').classList.add('show')
}

function removeWeather() {
  document.querySelector('#weather').classList.remove('show');
}

function formatterNumber(value, sufix) {
    return `
      ${(value).toFixed(1).toString().replace('.', ',')} ${sufix}
    `
}