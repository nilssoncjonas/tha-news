import { svtLatestNews } from "./svt.js";
import { readJSONFromFile } from "./utils/json.js";
import cron from 'node-cron'; 

console.log('server started:', new Date().toLocaleString('sv-SE'));

let count = 0;

cron.schedule('*/30 * * * *', async () => {

	const date = new Date();
	console.log('Scraping every 30 min', date.toLocaleString('sv-SE'), ++count, 'times');

	await svtLatestNews()

	const updated = readJSONFromFile('data/svt-latest.json')

	console.log(`Number of news: ${updated.length}`)
	console.log('----------')
}); 