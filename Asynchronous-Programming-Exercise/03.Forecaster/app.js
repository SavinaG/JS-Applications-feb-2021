function attachEvents() {
    const BASE_URL = "http://localhost:3030/jsonstore/forecaster";
 
    const domElements = {
        locationInput: document.getElementById('location'),
        submitButton: document.getElementById('submit'),        
        currentForecastDiv: document.getElementById('current'),
        upcomingForecastDiv: document.getElementById('upcoming'),
        forecastWrapper: document.getElementById('forecast')
    };
 
    const weatherIcons = {
        's': '\u2600',
        'p': '\u26C5',
        'o': '\u2601',
        'r': '\u2614',
        'd': '°'
    };
 
    function jsonMiddleware (res) {
        if (res.status >= 400) {
            throw(res);
        }
    
        return res.json();
    };
 
    domElements.submitButton.addEventListener('click', getWeather);
 
    function getWeather() {
        const location = domElements.locationInput.value.toLowerCase();
 
        domElements.locationInput.value = '';
        clearOutput();
 
        fetch(`${BASE_URL}/locations`)
            .then(jsonMiddleware)
            .then((data) => {
                if (!location) {
                    throw new Error('Enter a location');
                }
 
                let foundTown = data.find(t => t.name.toLowerCase() === location);
                if (!foundTown) {
                    throw new Error('Town not found');
                }
                Promise.all([
                    fetch(`${BASE_URL}/today/${foundTown.code}`).then(jsonMiddleware),
                    fetch(`${BASE_URL}/upcoming/${foundTown.code}`).then(jsonMiddleware)
                ])
                    .then(displayWeatherConditions)
                    .catch(handleError);
            })
            .catch(handleError);
    }
 
    function displayWeatherConditions([todayForecast, upcomingForecast]) {
        const { low, high, condition } = todayForecast.forecast;
 
        let forecastsDiv = createHTMLElement('div', ['forecasts']);
        let weatherIconSpan = createHTMLElement('span', ['condition', 'symbol'], weatherIcons[condition[0].toLowerCase()]);
        let conditionSpan = createHTMLElement('span', ['condition']);
 
        let nameSpan = createHTMLElement('span', ['forecast-data'], todayForecast.name);
 
        let degreesInfo = `${low}${weatherIcons.d}/${high}${weatherIcons.d}`;
        let degreesSpan = createHTMLElement('span', ['forecast-data'], degreesInfo);
 
        let weatherConditionSpan = createHTMLElement('span', ['forecast-data'], condition);
 
        conditionSpan.appendChild(nameSpan);
        conditionSpan.appendChild(degreesSpan);
        conditionSpan.appendChild(weatherConditionSpan);
 
        forecastsDiv.appendChild(weatherIconSpan);
        forecastsDiv.appendChild(conditionSpan);
 
        domElements.currentForecastDiv.appendChild(forecastsDiv);
        domElements.forecastWrapper.style.display = "block";
 
        displayUpcomingWeatherConditions(upcomingForecast);
    }
 
    function displayUpcomingWeatherConditions({name, forecast}) {
        let forecastInfoDiv = createHTMLElement('div', ['forecast-info']);
 
        forecast.forEach(({ low, high, condition }) => {
            let upcomingSpan = createHTMLElement('span', ['upcoming']); 
 
            let weatherIconSpan = createHTMLElement('span', ['symbol'], weatherIcons[condition[0].toLowerCase()]);
 
            let degreeseInfo = `${low}${weatherIcons.d}/${high}${weatherIcons.d}`;
            let degreesSpan = createHTMLElement('span', ['forecast-data'], degreeseInfo);
 
            let weatherConditionSpan = createHTMLElement('span', ['forecast-data'], condition);
 
            upcomingSpan.appendChild(weatherIconSpan);
            upcomingSpan.appendChild(degreesSpan);
            upcomingSpan.appendChild(weatherConditionSpan);
 
            forecastInfoDiv.appendChild(upcomingSpan);
        });
       
        domElements.upcomingForecastDiv.appendChild(forecastInfoDiv);
    }
 
    function handleError(err) {
        
        let error = document.createElement('span');
        error.classList.add('forecast-data');
        if (err.message) {
            error.textContent = `Error: ${err.message}`;
        } else {
            error.textContent = `Error: ${err.status} (${err.statusText})`;
        }
        
        domElements.currentForecastDiv.appendChild(error);
        domElements.forecastWrapper.style.display = 'block';
    }
 
    function clearOutput() {
        domElements.currentForecastDiv.innerHTML = '<div class="label">Current conditions</div>';
        domElements.upcomingForecastDiv.innerHTML = '<div class="label">Three-day forecast</div>';
    }
 
    function createHTMLElement(tagName, classNames, textContent) {
        let element = document.createElement(tagName);
     
        if (classNames) {
            element.classList.add(...classNames);
        }
     
        if (textContent) {
            element.textContent = textContent;
        }
     
        return element;
    }
}
 
attachEvents();