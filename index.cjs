const express = require('express');
const datastore = require('nedb');
const path = require('path');

const app = express();

const fs = require('fs')


app.listen(3000, () => console.log("Listening at 3000"));
app.use(express.static('public'));

const database = new datastore('database.db');
database.loadDatabase();
updateDb()

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateDb(){
    const data = await getAqiValues();
    console.log(Object.keys(data).length);
    for (city in data){
        const cityData = data[city];
        database.insert({name: city, lat: cityData.center.lat, lng: cityData.center.lng, pm10: cityData.pollutants.pm10, pm25: cityData.pollutants.pm25})
    }
}

async function getAttributes(){
    const lats = [];
    const lngs = [];
    const cityNames = [];
    const filePath = path.join(__dirname, 'Cities.csv');  // Get absolute path to 'test.csv'
    const data = fs.readFileSync(filePath, 'utf8')
    
  
    const rows = data.split('\n');
    for (let i = 0; i < rows.length; i++){
        elts = rows[i].split(',');
        cityName = elts[0];
        lat = elts[1];
        lng = elts[2];
        lats.push(lat);
        lngs.push(lng);
        cityNames.push(cityName);
    }
    return {lats, lngs, cityNames};
  }

async function getAqiValues(){
    const data = await getAttributes();
    const cityMap = {};
  
    for (let i = 0; i < data.lats.length; i++){
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${data.lats[i]}&lon=${data.lngs[i]}&start=1606223802&end=1606482999&appid=c77c653cd58975040009a20137296a8d`);
        const aqiData = await response.json();
        
        // Determine statistically the best method to do this
        const pm25Values = aqiData.list.map(entry => entry.components.pm2_5);
        const pm10Values = aqiData.list.map(entry => entry.components.pm10);

        console.log(Math.max.apply(null, pm25Values));
        
        cityMap[data.cityNames[i]] = {
            center: {
                lat: data.lats[i],
                lng: data.lngs[i]
            },
            pollutants: {
                pm25: Math.max.apply(null, pm25Values),
                pm10: Math.max.apply(null, pm10Values)
            }
        };

        console.log(i);

        await delay(1002);
    }
    return cityMap
  }