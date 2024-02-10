import { svtLatestNews } from "./svt.js";
import { readJSONFromFile } from "./utils/json.js";
import cron from 'node-cron'; 
import * as fs from 'fs';

console.log('server started:', new Date().toLocaleString('sv-SE'));

let count = 0;

cron.schedule(' */31 * * * * ', async () => {

	const date = new Date();
	console.log('Scraping every 30 min', date.toLocaleString('sv-SE'), ++count, 'times');

	await svtLatestNews(date.toLocaleDateString('sv-SE'))

	const updated = readJSONFromFile(`data/svt/${date.toLocaleDateString('sv-SE')}.json`)
	console.log(`Number of news: ${updated.length}`)
	console.log('----------')
}); 

cron.schedule('0 0 * * *', async () => {
	const date = new Date();
	console.log('Created new json store file', date.toLocaleDateString('sv-SE'));
	fs.writeFileSync(`data/svt/${date.toLocaleDateString('sv-SE')}.json`, JSON.stringify(data, null, 2));
});