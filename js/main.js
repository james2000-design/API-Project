const selectedCity = document.getElementById("citySelected");
const weatherDate = document.querySelectorAll(".weather-date");
const result = document.getElementById("get-results-heading");

// const parsedValue = JSON.parse(selectedValue);

const fetchData = async () => {
  let selectedValue = selectedCity.value;
  if (!selectedValue) {
    console.error("No value selected");
    return;
  }

  let parsedValue;

  parsedValue = JSON.parse(selectedValue);

  // 23.09,113.17
  const lat = parsedValue.lat;
  const lon = parsedValue.lon;

  console.log(`Latitude: ${lat}, Longitude: ${lon}`);

  result.innerHTML = "";
  let loadingMessage = `<p class= 'loading'>Getting Forecast...</p>`;
  result.innerHTML = loadingMessage;
  const loadingInterval = setInterval(() => {
    result.innerHTML = loadingMessage;
  }, 300);
  try {
    const response = await fetch(
      `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`
    );
    const data = await response.json();
    const weather = data.dataseries;
    clearInterval(loadingInterval);
    result.innerHTML = "";

    result.innerHTML = weather
      .map((data) => {
        const date = new Date(
          data.date.toString().slice(0, 4),
          data.date.toString().slice(4, 6) - 1,
          data.date.toString().slice(6, 8)
        );
        const dayName = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return `
          <div class="card ">
            <div class="card-top">
            <p class="weather-date">${dayName}</p>
            <div class="weather-icon-div">
              <img class="weather-icon" src="images/${data.weather}.png" alt="${data.weather}">
            </div>
            </div>
            <div class="card-body">
              <p class="weather-description">${data.weather.toUpperCase()}</p>
              <p class="weather-temperatures">H: ${data.temp2m.max} ºC</p>
              <p class="weather-temperatures">L: ${data.temp2m.min} ºC</p>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching the weather data:");
  }
};

selectedCity.addEventListener("change", fetchData);
fetchData();
