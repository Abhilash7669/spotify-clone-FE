export type CurrentWeather = {
  location: {
    name: string
    country: string
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
    feelslike_c: number
    humidity: number
    wind_kph: number
  }
}
