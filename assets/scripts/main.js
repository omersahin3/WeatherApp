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
                console.log(data)
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
        document.getElementById('icon').src = "https://openweathermap.org/img/wn//" + icon + ".png";
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
        const zone = (timezone - 10800)/3600;

        var r = new Date(0);
        var s = new Date(0); //ilk utc r değerine ekliyor

        document.getElementById('sunrise').textContent = this.utc(r, sunrise, zone);
        document.getElementById('sunset').textContent = this.utc(s, sunset, zone);
        var date = new Date();
        let hour3 = date.getHours();
        let minutes3 = date.getMinutes();
        this.mycalc(minutes3,hour3,zone);
        setInterval(() => { // only one country
            date = new Date();
            hour3 = date.getHours();
            minutes3 = date.getMinutes();
            console.log("t" + zone);
            this.mycalc(minutes3,hour3,zone);
        }, 1000);

        var options = { weekday: 'long', day: 'numeric' , month: 'short',};
        document.querySelector('#date').textContent = r.toLocaleString("en-US", options);
    },
    displayForecast: function(data) {
        // const{ icon } = data.list[0].weather[0];
        // const{ temp } = data.list[0].main;
        // console.log(icon,temp);
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
                    <div class="temp">Night - ${String(temp).slice(0,4)}&#176;C</div>
                    <div class="temp">Day - ${String(temp).slice(0,4)}&#176;C</div>
                </div>`
            }
            else
            {
                otherDayForcast +=
                `<div class="weather-forecast-item">
                    <div class="day">${d}</div>
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${String(temp).slice(0,4)}&#176;C</div>
                    <div class="temp">Day - ${String(temp).slice(0,4)}&#176;C</div>
                </div>`
            }
            document.getElementById('weather-forecast').innerHTML = otherDayForcast;
            document.querySelector('.main').style.visibility = "visible"; // ilk başta hidden olan şeyi visible
        }
    },
    displayCountry: function(data,query){
        const q = String(query).toLowerCase();
        const querylist = [];

        // console.log(data[227]['states']);
        const states = data[227]['states'];

        let querylistHtml = '';
        for(let i = 0; i< states.length ; i++){
            const cities = states[i]['cities'];
            for(let j = 0; j< cities.length ; j++){
                const name = String(cities[j]['name']).toLowerCase();
                if((name.slice(0,(query.length))).includes(q)) {
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
        first = false;
        this.fetchWeather(value,
        "forecast");
        this.fetchWeather(value,
        "weather");
        document.querySelector('.find').value=value;// açılır listeden gelen verilerin yazılmasını sağlıyor.
    },
    mycalc: function(minute, hour, zone) { // time
        if ( minute <= 9) // not 9 we want 09
        {
            minute = "0" + minute;
        }
        let nhour = Math.abs(hour + zone);
        if (nhour >= 12)
        {
            nhour = nhour%12;
        }
        const ampm = (hour + zone) >=12 ? 'PM' : 'AM' && (hour + zone) < 0 ? 'PM' : 'AM';
        if ( nhour <= 9) // not 9 we want 09
        {
            nhour = "0" + nhour;
        }
        document.querySelector('#time').innerHTML =`
        ${nhour + ":" + minute}
        <span id="am-pm">${ampm}</span>`
    },
    utc: function(r, utcSeconds, zone){ // sunrise sunset
        r.setUTCSeconds(utcSeconds);
        let hour = r.getHours();
        let minute = r.getMinutes();
        if ( minute <= 9) // not 9 we want 09
        {
            minute = "0" + minute;
        }
        let nhour = Math.abs(hour + zone);
        if (nhour >= 12)
        {
            nhour = nhour%12;
        }
        const ampm = (hour + zone) >=12 ? 'pm' : 'am' && (hour + zone) < 0 ? 'pm' : 'am';
        if ( nhour <= 9) // not 9 we want 09
        {
            nhour = "0" + nhour;
        }
        return nhour + ":" + minute + " " + ampm;
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
    // console.log(document.querySelector('.find').value);
    weather.fetchCountry(document.querySelector('.find').value);
});
    weather.fetchWeather("istanbul","forecast");
    weather.fetchWeather("istanbul","weather");



