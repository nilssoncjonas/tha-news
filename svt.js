import { readJSONFromFile, writeJSONToFile } from "./utils/json.js"
import puppeteer from 'puppeteer';

const url = 'https://www.svt.se/'

export const svtLatestNews = async () => {

	const browser = await puppeteer.launch({ headless: true })
	console.log('start')

	const page = await browser.newPage()

	await page.goto(url)

	await page.click('.LatestNews__showMore___sJcWj')

	const data = await page.evaluate((url) => {

		const arr = Array.from(document.querySelectorAll('.LatestNewsItem__root___oHHgk'))
		const data = arr.map((i) => ({
			title: i.querySelector('.LatestNewsItem__title___GFcfW').innerText,
			url: url + i.querySelector('.LatestNewsItem__link___ERU4W').getAttribute('href'),
			category: i.querySelector('.LatestNewsItem__section___FRr4a').innerText,
			published: i.querySelector('a span span time').getAttribute('datetime')
		}))
		return data
	}, url)

	await browser.close()

	console.log('saving')
	// Read existing data from file
	let existingData = readJSONFromFile('data/svt-latest.json')
	// Remove duplicates from new data
	const uniqueNewData = data.filter(newItem => !existingData.some((existingItem) => existingItem.title === newItem.title));
	// Append only unique data to existing data
	const updatedData = [...uniqueNewData, ...existingData];
	// Write the sorted data to file
	writeJSONToFile('data/svt-latest.json', updatedData)
	console.log('finished, New items:', uniqueNewData.length)
}