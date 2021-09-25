var first = true;
let weather = {
    apiKey: "49cc8c821cd2aff9af04c9f98c36eb74",
    fetchWeather: function (city,type) {
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
                // console.log(data)
                }
                else if(type == "forecast")
                this.displayForecast (data)
            });
    },
    fetchCountry: function (query) {
        fetch(
            "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json"
        )
            .then((response) => response.json())
            .then((data) => {
                this.displayCountry (data,query)
            });
    },
    displayWeather: function(data) {
        const{ name , timezone } = data;
        const{ icon, description } = data.weather[0];
        const{ temp, humidity, pressure } = data.main;
        const { speed } = data.wind;
        const { sunrise, sunset} = data.sys;
        const { lat, lon} = data.coord;
        // console.log(name,icon,description,temp,humidity,speed);
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
        if(first == true) // default background
        {
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1565036045177-025ab34fb5b3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=1080&ixid=MnwxfDB8MXxyYW5kb218MHx8SXN0YW5idWx8fHx8fHwxNjMyNDY4MzMx&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1920')";
        }
        var zone = (timezone - 10800)/3600;

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
        const{ icon } = data.list[0].weather[0];
        const{ temp } = data.list[0].main;
        console.log(icon,temp);
        let otherDayForcast = ''
        for(i=0; i<40; i+=8)
        {
            const{ icon } = data.list[i].weather[0]; 
            const{ temp } = data.list[i].main; 
            const{ dt_txt } = data.list[i];

            let d = String(new Date(dt_txt));
            d=d.slice(0,3);
            
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
            document.querySelector('.main').style.visibility = "visible"; // ilk başta hidden olan şeyi visible 
        }
    },
    displayCountry: function(data,query){
        const querylist = [];
        const q = String(query).toLowerCase();

        console.log(data[227]['states']);
        const states = data[227]['states'];
        let querylistHtml = '';

        for(let i = 0; i< states.length ; i++){
            const cities = states[i]['cities'];
            for(let j = 0; j< cities.length ; j++){
                const name = String(cities[j]['name']).toLowerCase();
                if(name.includes(q)) {
                    querylist.push(name);
                    querylistHtml += `<li onmousedown="weather.search('${name}')" class="queryLi" value="${name}">${name}</li>`;
                    document.getElementById('rlist').innerHTML = querylistHtml;
                }
                if(querylist.length == 5)
                {
                    i = states.length
                    j = cities.length
                }
            }
        }
    },
    search: function (value) {
        this.fetchWeather(value,
        "forecast");
        this.fetchWeather(value,
        "weather");
        first = false;
    },
};
document.querySelector('#search').addEventListener("click", function () {
    weather.search(document.querySelector('.find').value);
});
document.querySelector('.find').addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search(document.querySelector('.find').value);
    }
});
document.querySelector('.find').addEventListener("input", function () {
    console.log(document.querySelector('.find').value);
    weather.fetchCountry(document.querySelector('.find').value);
});
weather.fetchWeather("istanbul","forecast");
weather.fetchWeather("istanbul","weather");
