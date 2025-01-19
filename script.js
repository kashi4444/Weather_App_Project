const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector("[weather-container]");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");

let oldTab= userTab;
const API_KEY="f51cff68ee8fb18d8c31b8b966707313";
oldTab.classList.add("current-tab");

getfromSessionStorage();

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wala tab pr tha, ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            grantAccessContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    // pass tab as input parameter
    switchTab(userTab);

});
searchTab.addEventListener("click",()=>{
    // pass tab as input parameter
    switchTab(searchTab);

});

async function fetchWeatherUserInfo(coordinates){
    const {lat, lon}= coordinates;
    //make grantContainer Invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json(); 
        console.log("WEATHER IS_:",data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        //HW
    }
}
//check if cordinates are present in session storage
function  getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nahi  mile
        grantAccessContainer.classList.add("active");
    }else{
        console.log(localCoordinates)
        const coordinates= JSON.parse(localCoordinates);
        console.log(coordinates);
        fetchWeatherUserInfo(coordinates);
        console.log("hello");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly, we have to fetch the elemnts

    const cityName= document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");

    //fetch value from weatherInfo object and put it UI elements
    cityName.innerText= `${weatherInfo?.name}`;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp - 273.15}°C `;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("Geolocation support is not available");
    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    
    fetchWeatherUserInfo(userCoordinates);
}
grantAccessButton.addEventListener("click",getLocation);

const searchInput= document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName= searchInput.value;
    if(cityName===""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }catch(err){
        console.log("error found");
        loadingScreen.classList.remove("active");
    }
}





