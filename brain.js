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
  
  // storedAqiData = await getAqiValues();
  
  async function initMap() {
    // Create the map.
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      center: { lat: 28.09, lng: 77.712 },
      mapTypeId: "terrain",
    });
    const citymap = {};
  
    const response = await fetch('city_aqi_data.csv');
    const data = await response.text();


    const rows = data.split("\n").slice(1)


    console.log(rows)
    rows.forEach(row => {
      const cityinfo = row.split(',');
      citymap[cityinfo[0]] = {
        center: {
          lat: parseFloat(cityinfo[1]),
          lng: parseFloat(cityinfo[2])
        },
        pollutants: {
          pm25: cityinfo[3],
          pm10: cityinfo[4]
        }
      }

    })
    for (const city in citymap) {
      const cityCircle = new google.maps.Circle({
        strokeColor: getColor(citymap[city].pollutants.pm25),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getColor(citymap[city].pollutants.pm25),
        fillOpacity: 0.8,
        map,
        center: citymap[city].center,
        radius: 50000,
      });
  
    }}
    
  
  
  
window.initMap = initMap;
