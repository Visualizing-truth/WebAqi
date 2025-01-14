import csv
import requests

def average(ls):
    sum = 0
    for i in range(len(ls)):
        sum += ls[i]
    return sum/len(ls)


with open('Cities.csv', newline='') as csvfile:
    cityInfo = csv.reader(csvfile, delimiter='\n', quotechar='|')

    with open('cities_with_aqi.csv', 'w', newline='') as csvfile:
        newCsv = csv.writer(csvfile, delimiter=',')
        for row in cityInfo:
            cityInfo = row[0].split(',')
            print(cityInfo)

            cityName = cityInfo[0]
            print(cityName)
            lat = cityInfo[1]
            lng = cityInfo[2]
            api_url = f"http://api.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lng}&start=1606223802&end=1606482999&appid=c77c653cd58975040009a20137296a8d"
            response = requests.get(api_url)
            data = response.json()
            pm25Values = []
            pm10Values = []
            for i in range(len(data['list'])):
                pm25Values.append(data['list'][i]['components']['pm2_5'])
                pm10Values.append(data['list'][i]['components']['pm10'])

            avgPm25 = average(pm25Values)
            avgPm10 = average(pm10Values)

            newCsv.writerow([cityName, lat, lng, avgPm25, avgPm10])

            
                

                



        
