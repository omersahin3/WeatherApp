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
        document.getElementById('country').textContent = name;
        document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById('temp').textContent = temp;
        document.getElementById('humidity').textContent = humidity + "%";
        document.getElementById('wind').innerText = speed + " km/h";
        document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1080/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector('.find').value);
    },
};
document.querySelector('#search').addEventListener("click", function () {
    weather.search();
});
