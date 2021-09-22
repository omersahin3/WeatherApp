let weather = {
    apiKey: "49cc8c821cd2aff9af04c9f98c36eb74",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
            // .then((data) => console.log(data));
    },
    displayWeather: function(data) {
        const{ name } = data;
        const{ icon, description } = data.weather[0];
        const{ temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(name,icon,description,temp,humidity,speed);
    }
};
