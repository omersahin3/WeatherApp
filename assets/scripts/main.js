let weather = {
    
    apiKey: "49cc8c821cd2aff9af04c9f98c36eb74",
    fetchWeather: function (city,type) {
        const obj = {};
        fetch(
            "https://api.openweathermap.org/data/2.5/" + type +"?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => response.json())
            .then((data) => {
                if (type == "weather")
                {
                this.displayWeather (data)
                console.log(data)
                }
                else if(type == "forecast")
                this.displayForecast (data)
            });
    },
    displayWeather: function(data) {
        const{ name , timezone } = data;
        const{ icon, description } = data.weather[0];
        const{ temp, humidity, pressure } = data.main;
        const { speed } = data.wind;
        const { sunrise, sunset} = data.sys;
        const { lat, lon} = data.coord;
        console.log(name,icon,description,temp,humidity,speed);
        document.getElementById('country').textContent = name;
        document.getElementById('location').textContent = (String(lat).slice(0,6)) + 'N ' + (String(lon).slice(0,6)) +'E';
        document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById('description').textContent = description;
        document.getElementById('temp').textContent = temp;
        document.getElementById('humidity').textContent = humidity + "%";
        document.getElementById('pressure').textContent = pressure;
        document.getElementById('wind').innerText = speed + " km/h";
        document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1080/?" + name + "')";

        var zone = (timezone - 10800)/3600;
        console.log(zone);

        var utcSeconds = sunrise;
        var r = new Date(0); 
        r.setUTCSeconds(utcSeconds);
        const hour = r.getHours();
        const minutes = r.getMinutes();
        const ampm = hour >=12 ? 'pm' : 'am';
        document.getElementById('sunrise').textContent = (hour + zone) + ":" + minutes + " " + ampm;

        var utcSeconds2 = sunset;
        var s = new Date(0); 
        s.setUTCSeconds(utcSeconds2);
        const hour2 = s.getHours();
        const minutes2 = s.getMinutes();
        const ampm2 = hour2 >=12 ? 'pm' : 'am';
        document.getElementById('sunset').textContent = (hour2 + zone) + ":" + minutes2 + " " + ampm2;

        var date = new Date();
        const hour3 = date.getHours();
        const minutes3 = date.getMinutes(); 
        const ampm3 = hour3 >=12 ? 'PM' : 'AM';
        // document.querySelector('#time').textContent = hour3 + ":" + minutes3 + " " + ampm3;

        document.querySelector('#time').innerHTML =`
        ${(hour3 + zone) + ":" + minutes3}
        <span id="am-pm">${ampm3}</span>
        `

        var options = { weekday: 'long', day: 'numeric' , month: 'short',};
        document.querySelector('#date').textContent = r.toLocaleString("en-US", options);
        
    },
    displayForecast: function(data) {
        const{ name } = data.city;
        const{ icon } = data.list[0].weather[0];
        const{ temp } = data.list[0].main;
        console.log(name,icon,temp);
        document.getElementById('country').textContent = name;
        // document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
        // document.getElementById('temp').textContent = temp;
        document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1920x1080/?" + name + "')";
        let otherDayForcast = ''
        for(i=0; i<40; i+=8)
        {
            const{ icon } = data.list[i].weather[0]; 
            const{ temp } = data.list[i].main; 
            const{ dt_txt } = data.list[i];

            let d = String(new Date(dt_txt));
            d=d.slice(0,3);
            console.log(d);
            
            if(i==0)
            {
                document.getElementById('current-temp').innerHTML = 
                `<img src="http://openweathermap.org/img/wn//${icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${d}</div>
                    <div class="temp">Night - ${temp}&#176;C</div>
                    <div class="temp">Day - ${temp}&#176;C</div>
                </div>`
            }
            else 
            {   
                otherDayForcast += 
                `<div class="weather-forecast-item">
                    <div class="day">${d}</div>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${temp}&#176;C</div>
                    <div class="temp">Day - ${temp}&#176;C</div>
                </div>`
            }
            document.getElementById('weather-forecast').innerHTML = otherDayForcast;
        }
    },
    search: function () {
        this.fetchWeather(document.querySelector('.find').value,
        "forecast");
        this.fetchWeather(document.querySelector('.find').value,
        "weather");
    },
};
document.querySelector('#search').addEventListener("click", function () {
    weather.search();
});
document.querySelector('.find').addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search();
    }
})

