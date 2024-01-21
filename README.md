# Weather App

Weather app shows current in inputed country/city

## Usage

1. Download this project
2. Open console in root folder of the project
3. Run next command:
```console
    $ npm start
```
4. Get to the next url - http://localhost:3000

# !WARNING!

- This project uses 3 API's - Open Weather API, Google Maps API and COVID-19 Open API
- To correctly use COVID-19 API you should enter **only countries** in search bar, because there is no city specific COVID info
- Project uses Clean Architecture to utilize every file as needed, separating templates in 'views', static files as 'public' and routes in 'routes'
- Bootstrap is used to style website
- Background is changing depending on weather in inputed city/country (it may not always be 100% correct)
