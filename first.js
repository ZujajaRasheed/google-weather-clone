
const now=new Date();
const currHour=now.getHours();
let date;
let weatherStatus;
 let newData;
 let temp;
navigator.geolocation.getCurrentPosition(success);

async function success(position) 
{
    try{
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
let url=`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=ba9f2696554242938541d1333d3f31ab`;
    console.log("Lat:", latitude, "Long:", longitude);
    let loc=await fetch(url);
    let newLoc=await loc.json();
    console.log(newLoc);
      let component = newLoc.results[0].components;
      console.log(component.city)
      console.log(component.suburb);
     console.log(component);
 document.querySelector("#location-info p").innerText=`${component.suburb},${component.city}`;
getWeather(latitude,longitude);
}catch  (err)
{
console.log("error in success fun",err);
}
}







 async function getWeather(latitude,longitude)
 {
 let url=`https://api.weatherapi.com/v1/forecast.json?key=b0b453be30984a4e928181114251707&q=${latitude},${longitude}&days=8`;
 let data=await fetch(url);
  newData=await data.json();
console.log(newData);

weatherHeader();

temperatureGraphData();
weekWeather();
 }



//weather Header

//https://api.opencagedata.com/geocode/v1/json?q=33.6348757+72.979262&key=ba9f2696554242938541d1333d3f31ab
  function weatherHeader()
 {

 temp=Math.round(newData.current.temp_c);
let humidity=newData.current.humidity;
let wind=Math.round(newData.current.wind_kph);
document.querySelector("#temperature h1").innerText=temp;
document.querySelector("#humidity").innerText=`Humidity:${humidity}%`;
document.querySelector("#wind").innerText=`Wind:${wind}km/h`;
console.log(temp);
console.log(humidity);
console.log(wind);
let iconUrl="https:"+newData.current.condition.icon;
document.querySelector("#temperature img").src=iconUrl;
 
 weatherStatus= document.querySelector("#weather-status");
  weatherStatus.innerText=newData.current.condition.text;
console.log(weatherStatus);
date=newData.forecast.forecastday[0].date;

console.log(date); 
let day=new Date(date).toLocaleDateString("en-US",{weekday:"long"});
console.log(day);

document.querySelector("#day").innerText=day;
let precipitation=newData.forecast.forecastday[0].day.daily_chance_of_rain;
console.log(precipitation);
document.querySelector("#precipitation").innerText=`Precipitation:${precipitation}%`;
 }

 //Weather Button(°C and °F )

tempButtons=document.querySelectorAll("#temperature button");
tempButtons.forEach((btn)=>
{
    btn.addEventListener("click",()=>
    {  
if(btn.innerText==="°C")
{
document.querySelector("#temperature h1").innerText=temp;

btn.style.color="white";
document.querySelector("#ferenheit").style.color="lightgray";
}
else {
  let tempF= Math.round(newData.current.temp_f); 
  document.querySelector("#temperature h1").innerText=tempF;
  document.querySelector("#celsius").style.color="lightgray";
  btn.style.color="white";
}});
});

//graph to show temperature and precipitation
let tempChart=null;
function drawGraph(topArray,val,borderColor,bgColor,topcol)
{
  timeHour12();
 const mainDiv=document.querySelector("#graph");
 const oldCanvas=document.querySelector(".weather-chart");
 if(oldCanvas)
 {
    mainDiv.removeChild(oldCanvas);
 }
 const Divcontainer=document.querySelector(".container");
 if(Divcontainer)
 {
 mainDiv.removeChild(Divcontainer);
 }
let canvass=document.createElement("canvas");
canvass.classList.add("weather-chart")
document.querySelector("#graph").appendChild(canvass);
   const ctx = canvass.getContext('2d');
   
   tempChart= new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        data: topArray,
        backgroundColor:bgColor,
        borderColor:borderColor,
        borderWidth: 4,
        
        tension: 0.4,
        fill: true,
        pointRadius: 0,  // 🔴 No circles/dots shown
      }]
    },
    options: {
      responsive: true,  // ✅ Adjusts size on all screens
        maintainAspectRatio: false, 
        layout: {
    padding: {
      top: 30,     
      bottom: 0,   
      left: 0,
      right: 0
    }
},
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: function(value) {
            
            return value + val;
          },
          font: {
            weight: 'bold'
          },
          color: topcol,
        }
      },
      scales: {
        y: {
          display: false  // ❌ Hide y-axis
        },
        x: {
            tricks:{
                color:'lightgray'
            },
          title: {
            display: true,
            text: ''
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });

}


//WEATHER BUTTONS ...Temperature,Precipitation,wind

let weatherButtons =document.querySelectorAll("#weather-buttons button");
let type=null;
 weatherButtons.forEach((btn)=>
{
    
btn.addEventListener("click",()=>
{
type=btn.innerText;
    // weatherButtons.forEach((b)=>
    // {

    //     b.classList.remove("active");
    // });
    // btn.classList.add("active");
let userChoice=btn.innerText
showGraph(userChoice);
});

 });

//CHECKE WHICH FUN TO CALL BASED ON USERCHOICE LIKE TEMP,PRECIP,WIND

function showGraph(type)
{
    if(type==="Temperature")
     {  

 temperatureGraphData();
    }
    else if(type==="Precipitation")
    {
      precipitationGraphData();
    }
    else{

    windGraphData();

    }
 }
//FUNCTION TO CONVERT 12HOUR INTO 24HOUR

let hoursArray=[];
function time()
{

hoursArray=[];
for(let i=0;i<8;i++)
{
  let hour=(currHour+i*3)%24;
  
  
    hoursArray.push(hour);
}
}

//FUNCTION TO FETCH DATA FOR TEMP GRAPH

function temperatureGraphData()
{let tempArray=[];

   
    time();
tempArray =hoursArray.map((h)=>
{

return Math.round(newData.forecast.forecastday[0].hour[h].temp_c);
});
console.log("hours",hoursArray);
console.log("temperature",tempArray);
let borderCol='#FF8C00';
let bgColor='rgba(255, 140, 0, 0.2)';
let topCol='lightgray';
drawGraph(tempArray,'°',borderCol,bgColor,topCol);
}

//FUNCTION TO CONVERT IN 12HOUR WITH AM OR PM
let timeLabels=[];//array 12hours
function timeHour12(){
 timeLabels = hoursArray.map(h => {
    let ampm = h < 12 ? "AM" : "PM";
    let hour = h % 12 === 0 ? 12 : h % 12; // convert 0 -> 12, 13 -> 1, etc.
    
    return `${hour} ${ampm}`;
});
}

//FUNCTION TO FETCH DATA FOR PRECIPITATION GRAPH
function precipitationGraphData()
{
    let precipArray=[];
    time();
precipArray =hoursArray.map((h)=>
{

return newData.forecast.forecastday[0].hour[h].chance_of_rain;
});
console.log("hours",hoursArray);
console.log("precipitation",precipArray);
let borderCol='#1E90FF';
let bgColor='rgba(30, 144, 255, 0.3)';
let topCol='#1E90FF';
drawGraph(precipArray,'%',borderCol,bgColor,topCol);

console.log("12hoursarray",timeLabels);
}



//FUNCTION TO FETCH WIND DATA FROM API
 let windArray=[];
function windGraphData()
{

    time();
windArray =hoursArray.map((h)=>
{

return Math.round(newData.forecast.forecastday[0].hour[h].wind_kph);

});
let windDeg=[];
windDeg=hoursArray.map((h)=>
{
  return Math.round(newData.forecast.forecastday[0].hour[h].wind_degree);  
});

console.log("hours",hoursArray);
console.log("windArray",windArray);
showWindGraph(windDeg);
}   



//FUN TO GET DAY ,IMG ICON AND TEMP ACCORDING TO DAY FROM API
 function weekWeather()
 {

     let weeklyDiv=document.querySelectorAll(".day-box");
     let days=document.querySelectorAll(".day-name");
     let daysImg=document.querySelectorAll(".day-icon");
     let dayTemp=document.querySelectorAll(".day-temp");

     for(let i=0;i<8;i++)
     {
date=newData.forecast.forecastday[i].date;
let day=new Date(date).toLocaleDateString("en-US",{weekday:"short"});
weeklyDiv[i].setAttribute("data-day",day);
days[i].innerText=day;
daysImg[i].src="https:"+newData.forecast.forecastday[i].day.condition.icon;
let maxTemp=Math.round(newData.forecast.forecastday[i].day.maxtemp_c);
let minTemp=Math.round(newData.forecast.forecastday[i].day.mintemp_c);
dayTemp[i].innerText=`${maxTemp} ${minTemp}`;
console.log(weeklyDiv[i]);
     }
     
 }


 //BUTTONS LIKE FRI,MON THAT APPEAR AT THE BOTTOM OF WEATHER
  let daysButtons=document.querySelectorAll(".day-box");
 daysButtons.forEach((btn,i)=>{

    btn.addEventListener("click",()=>
{
console.log("you clicked on ",i);
showDaysWeather(i);
});
  });
//FUN THAT ACTUALLY SHOW DATA WHEN WEEK DAY BUTTON WILL CLICK
function showDaysWeather(i)
{
console.log("btn pressed",type);
 weatherStatus.innerText=newData.forecast.forecastday[i].day.condition.text;
 time();
    if(type==="Temperature"||type===null)
    {
 let tempArr=[];
     //time();
     tempArr= hoursArray.map((h)=>
    {
return Math.round(newData.forecast.forecastday[i].hour[h].temp_c);

    }) ; 
    
    console.log(tempArr);
    let borderCol='#FF8C00';
let bgColor='rgba(255, 140, 0, 0.2)';
let topCol='lightgray';
   drawGraph(tempArr,'°',borderCol,bgColor,topCol);
}

 if(type=="Precipitation")
{let preArr=[];
 preArr= hoursArray.map((h)=>
    {
return Math.round(newData.forecast.forecastday[i].hour[h].chance_of_rain);
 }) ; 

console.log("precipitation",preArr);
let borderCol='#1E90FF';
let bgColor='rgba(30, 144, 255, 0.3)';
let topCol='#1E90FF';
drawGraph(preArr,'%',borderCol,bgColor,topCol);
}
else if(type==="Wind")
{

  let windDegg=[];
  windDegg=hoursArray.map((h)=>
  {
return Math.round(newData.forecast.forecastday[i].hour[h].wind_degree);
  });
  showWindGraph(windDegg);
}
}


//FUN THAT ACTUALLY SHOWS WIND GRAPH WHEN WIND BUTTON CLICKS
function showWindGraph(windDeg)
{
  console.log(windDeg);

  const mainDiv=document.querySelector("#graph");
 const oldCanvas=document.querySelector(".weather-chart");
 const Divcontainer=document.querySelector(".container");
 if(oldCanvas)
 {
    mainDiv.removeChild(oldCanvas);
   
 }
 if(Divcontainer)
 {
 mainDiv.removeChild(Divcontainer);
 }
  let container=document.createElement("div")
        container.classList.add("container");

 for(let i=0;i<windDeg.length;i++)
    {
        let itemDiv=document.createElement("div");
 itemDiv.classList.add("item-div");
        let wind=document.createElement("div");
        wind.classList.add("wind-div");
        wind.innerText=windArray[i]+"km/h";
        let arrow   =document.createElement("div");
        arrow.classList.add("arrow-div");
        arrow.innerText="↑";
     
        arrow.style.transform=`rotate(${windDeg[i]+180}deg)`;
        let hour=document.createElement("div");
        hour.classList.add("hour-div");
        hour.innerText=timeLabels[i];


        itemDiv.appendChild(wind);
         itemDiv.appendChild(arrow);
          itemDiv.appendChild(hour);
 container.appendChild(itemDiv);

    }  
   
    mainDiv.appendChild(container);
}