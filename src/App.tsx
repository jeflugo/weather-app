import { useEffect, useState } from 'react'

const API_KEY = 'a78a7395e44a4ba09ae11340240105'
const weekDays = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
]

function App() {
	const [weather, setWeather] = useState<{
		current: any
		forecast: any
		location: any
	}>({
		current: null,
		forecast: null,
		location: null,
	})
	const [coords, setCoords] = useState<{ lat: number; lon: number }>()

	const { current, forecast, location } = weather

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position =>
				setCoords({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				}),
			error => console.error('Error getting user location:', error),
		)
	}, [])

	useEffect(() => {
		const API_URL =
			coords &&
			`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${coords.lat},${coords.lon}&days=3&aqi=no&alerts=no
`
		if (API_URL)
			fetch(API_URL)
				.then(res => res.json())
				.then(data =>
					setWeather({
						current: data.current,
						forecast: data.forecast.forecastday,
						location: data.location,
					}),
				)

		return () => {}
	}, [coords])

	if (!coords)
		return (
			<div className='flex h-screen items-center justify-center'>
				<h1 className='mt w-96 text-center text-4xl'>
					This app cannot work if you dont give location access
				</h1>
			</div>
		)
	return (
		<div className='mx-auto w-[500px]'>
			{current && (
				<div>
					<div className='mb-4 text-center'>
						<h1 className='text-4xl font-bold'>Weather app</h1>
						<h3 className='text-2xl'>
							Weather in {location.name}, {location.region}, {location.country}
						</h3>
					</div>
					<div className='mb-6 flex justify-center'>
						<div className='rounded-md border border-yellow-600 px-4 py-2'>
							<h4 className=''>Today's weather</h4>
							<div className='flex gap-3'>
								<img
									title={current?.condition.text}
									src={current?.condition.icon}
									className='w-10'
								/>
								<div>
									<p title='Termal feeling'>{current?.feelslike_c} C</p>
									<p title='Temperature'>{current?.temp_c} C</p>
								</div>
							</div>
						</div>
					</div>
					<h3 className='mb-2 text-center text-2xl'>Forecast</h3>
					<div className='flex justify-center gap-4'>
						{forecast.map(({ date, day }, i) => {
							const d = new Date(date)
							const weekDay = d.getDay()
							if (i === 0) return
							return (
								<div className='flex w-52 flex-col items-center rounded-md border border-black px-4 py-2'>
									<h4 className='text-wrap'>
										{i === 1
											? "Tomorrow's weather"
											: `${weekDays[weekDay]}'s weather`}
									</h4>
									<div className='flex gap-3'>
										<img
											title={day?.condition.text}
											src={day?.condition.icon}
											className='w-10'
										/>
										<div>
											<p title='Max Temp'>{day?.maxtemp_c} C</p>
											<p title='Avg Temp'>{day?.avgtemp_c} C</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</div>
	)
}

export default App
