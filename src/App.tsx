import { useEffect, useState } from 'react'

const API_KEY = 'a78a7395e44a4ba09ae11340240105'

function App() {
	const [weather, setWeather] = useState()
	const [location, setLocation] = useState<{ lat: number; lon: number }>()

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position =>
				setLocation({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				}),
			error => console.error('Error getting user location:', error),
		)
	}, [])

	useEffect(() => {
		const API_URL =
			location &&
			`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location.lat},${location.lon}&aqi=no
`
		if (API_URL)
			fetch(API_URL)
				.then(res => res.json())
				.then(data => {
					console.log(data.current)
					setWeather(data.current)
				})

		return () => {}
	}, [location])

	return <div>{weather && weather.condition.text}</div>
}

export default App
