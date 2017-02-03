### Insurance Gauge
### @aug2uag <aug2uag@gmail.com>

# API Documentation

### Retrieving Risk Score

##### **GET** `/api/v1/score`
Retrieves crime and extreme weather data derived risk score

Param | data type | valid values
---- | ----- | ------
`city` | number | zip code value
`crime` | string | ['arrest', 'arson', 'assault', 'burglary', 'robbery', 'shooting', 'theft', 'vandalism', 'other', 'all']
`weather` | string | ['fog', 'rain', 'snow', 'hail', 'tornado']
`report` | string | 'yes' to return PDF report


### API Details
Source | purpose | key
---- | ---- | ------
WeatherUnderground | real-time and historical weather data | `7965613c4a99c7b3`
SpotCrime | crimes data | N/A
Zillow | property valuation data | `X1-ZWz1fiww8j5jij_8w9nb`