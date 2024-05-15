import { readJSONFromFile, writeJSONToFile } from "./utils/json.js"
import puppeteer from 'puppeteer';
import { store } from './utils/store.js';

const url = 'https://www.svt.se'

export const svtLatestNews = async (date) => {

	const browser = await puppeteer.launch({ headless: true })
	console.log('Getting data...')

	const page = await browser.newPage()

	await page.goto(url)

	await page.click('.LatestNews__showMore___sJcWj')

	const data = await page.evaluate((url) => {

		const arr = Array.from(document.querySelectorAll('.LatestNewsItem__root___xKB7B'))
		const data = arr.map((i) => ({
			title: i.querySelector('.LatestNewsItem__title___YAJH7').innerText,
			url: url + i.querySelector('.LatestNewsItem__link___VDAfy').getAttribute('href'),
			category: i.querySelector('.LatestNewsItem__section___o5a-Z').innerText,
			published: i.querySelector('a span span time').getAttribute('datetime')
		}))
		return data
	}, url)

	await browser.close()
	console.log('Data received...')
	if (!data || data.length === 0) {
		console.log('No data available')
		return
	}

	console.log('Checking for items published today...')
	const filteredObjects = data.filter(object => {
		const publishedDate = new Date(object.published).toLocaleDateString('sv-SE'); // Extract date from "published"
		return publishedDate === date;
	});

	// Getting existing data to compare against the new
	let existingData = readJSONFromFile(`data/svt/${date}.json`)

	console.log('Checking for new items...')
	const uniqueNewData = filteredObjects.filter(newItem => !existingData.some((existingItem) => existingItem.url === newItem.url));

	if (uniqueNewData.length > 0) {
		console.log('New items found, storing...')

		await store(uniqueNewData)

		const updatedData = [...uniqueNewData, ...existingData];

		writeJSONToFile(`data/svt/${date}.json`, updatedData)

		console.log('finished, New items:', uniqueNewData.length)
	} else {
		console.log('No new items...')
	}
}