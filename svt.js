import { readJSONFromFile, writeJSONToFile } from "./utils/json.js"
import puppeteer from 'puppeteer';
import { store } from './utils/store.js';

const url = 'https://www.svt.se'

export const svtLatestNews = async (date) => {

	const browser = await puppeteer.launch({ headless: true })
	console.log('started scraping')

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
	console.log('finished scraping')

	let existingData = readJSONFromFile(`data/svt/${date}.json`)
	
	const uniqueNewData = data.filter(newItem => !existingData.some((existingItem) => existingItem.title === newItem.title));

// Get the current date to compare against
const currentDate = new Date();

// Filter out items that were published today
const publishedToday = uniqueNewData.filter(item => {
    // Convert the "published" field to a Date object
    const publishedDate = new Date(item.published);

    // Compare the date part (year, month, and day) only
    return publishedDate.toDateString() === currentDate.toDateString();
});
	// console.log('publishedToday:', publishedToday.length, publishedToday)

	if (publishedToday.length > 0) {		
		console.log('New items found, storing...')
		
		await store(publishedToday)	
		
		const updatedData = [...publishedToday, ...existingData];
		
		writeJSONToFile(`data/svt/${date}.json`, updatedData)

		console.log('finished, New items:', publishedToday.length)
	} else {
		console.log('No new items')
	}
}