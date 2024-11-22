//const for Search button and display weather div
const btnSearch = document.querySelector('.btn-get-city');
const displayWeather = document.querySelector('.display-weather');
const search = document.querySelector('.search')
const forecastInfo = document.querySelector('.forecast-info')

//const city
const getCity = async (city) => {
    try {
        const response = await fetch (`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
        const data = await response.json()
        return data.results[0]
    } catch (err) {
        console.error(err)
    }
}

//const getWeather
const getWeather = async (latitude, longitude) => {
    try {
        const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`)
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

//Search button
btnSearch.addEventListener('click', async () => {
    const city = document.querySelector('.city').value //input
    const weatherCity = await getCity (city)
    
    if (weatherCity) {
        const weatherData = await getWeather (weatherCity.latitude, weatherCity.longitude)

        if (weatherData) {
            const country = weatherCity.country || "Unavailable"
            const temperature = weatherData.current ? weatherData.current.temperature_2m : "N/A"
            const timezone = weatherCity.timezone || "Unavailable"
            const population = weatherCity.population || "Unavailable"

            //Tomorrow's Forecast
            const tomorrowDate = weatherData.daily.time[1]
            const maxTemp = weatherData.daily.temperature_2m_max[1]            
            const minTemp = weatherData.daily.temperature_2m_min[1]

            let buildHtml = `
            <div class="city-title">
                <h2> <span>${city}</span> </h2>
                <h2> <span>${temperature} °C</span> </h2>
            </div>

            <div class="forecast-info">
                <h3> Country: </h3> <span>${country}</span>
                <h3> Timezone:  </h3> <span>${timezone}</span>
                <h3> Population: </h3> <span>${population}</span>
                <h3> Tomorrow's Forecast: </h3> 
                    <ul>
                    <span>${tomorrowDate}</span>
                    <li>Low: ${minTemp} °C</li>
                    <li>Max: ${maxTemp} °C</li>
                    </ul>
            </div>
            `
        
            displayWeather.innerHTML = buildHtml
            //Background image in the .city-title div
            const cityTitle = document.querySelector('.city-title')
            cityTitle.style.backgroundImage = "url('../images/day.jpg')"
        }  else {
            displayWeather.innerHTML = "Weather Data Not Available"
        } 
    } else {
            displayWeather.innerHTML = "City Data Not Available"
        
    }
  
});