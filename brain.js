function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function getColor(currPm25Value){
    
    if (currPm25Value<=50){
      // green
      return "rgb(0, 128, 0)"
    }
    if (currPm25Value<=100) {
      // yellow
      return "rgb(255, 255, 0)"
    }
    if (currPm25Value<=150) {
      // orange
      return "rgb(255, 165, 0)"
    }
    if (currPm25Value<=200) {
      // red
      return "rgb(255, 0, 0)"
    }
    if (currPm25Value<=300 ) {
      // purple
      return "rgb(128, 0, 128)"
    }
    if (currPm25Value>300){
        // brown/maroon
        return "rgb(128, 0, 32)"
  
    }
  }
  
  
  async function getAttributes(){
    const lats = [];
    const lngs = [];
    const cityNames = [];
    const response = await fetch('test.csv');
    const data = await response.text();
  
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
    lats = data.lats;
    lngs = data.lngs;
    console.log(lats);

    MaxPm25 = [];
    MaxPm10 = [];
  
    for (let i = 0; i < lats.length; i++){
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lats[i]}&lon=${lngs[i]}&start=1606223802&end=1606482999&appid=c77c653cd58975040009a20137296a8d`);
        const aqiData = await response.json();
        
        // Determine statistically the best method to do this
        const pm25Values = aqiData.list.map(entry => entry.components.pm2_5);
        const pm10Values = aqiData.list.map(entry => entry.components.pm10);
        MaxPm10.push(Math.max.apply(null,pm10Values));
        MaxPm25.push(Math.max.apply(null,pm25Values));
        console.log(i);
        console.log(Math.max.apply(null,pm25Values))
        await delay(1002);
    }
    
    return {MaxPm25, MaxPm10}
  }
  
  // storedAqiData = await getAqiValues();
  
  
  
  async function initMap() {
    // Create the map.
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      center: { lat: 28.09, lng: 77.712 },
      mapTypeId: "terrain",
    });
  
    const data = await getAttributes();
    const aqiData = await getAqiValues();
    const citymap = {};
  
    for (let i = 0; i<data.lats.length; i++){
      citymap[data.cityNames[i]] = {
        center: {
          lat: parseFloat(data.lats[i]),
          lng: parseFloat(data.lngs[i])
        },
        pm25: aqiData.MaxPm25[i]
      }
  
    }
    for (const city in citymap) {
      const cityCircle = new google.maps.Circle({
        strokeColor: getColor(citymap[city].pm25),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getColor(citymap[city].pm25),
        fillOpacity: 0.8,
        map,
        center: citymap[city].center,
        radius: 50000,
      });
    }
  }
  
window.initMap = initMap;
