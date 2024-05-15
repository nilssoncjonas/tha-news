import { svtLatestNews } from "./svt.js";
import { visitjnDev } from "./jndev.js";
import { readJSONFromFile, writeJSONToFile } from "./utils/json.js";
import cron from 'node-cron';
import * as fs from 'fs';

console.log('server started:', new Date().toLocaleString('sv-SE'));

cron.schedule('01 * * * * ', async () => {

	const date = new Date();
	const file = `data/logs/svt/cron/${date.toLocaleDateString('sv-SE')}.json`
	const logs = readJSONFromFile(file)

	// console.log('Scraping every 30 min', date.toLocaleString('sv-SE'), ++count, 'times');

	await svtLatestNews(date.toLocaleDateString('sv-SE'))

	const updated = readJSONFromFile(`data/svt/${date.toLocaleDateString('sv-SE')}.json`)
	// console.log(`Number of news: ${updated.length}`)
	// console.log('----------')
	
	const logItem = {
		"time": date.toLocaleTimeString('sv-SE'),
		"count": logs.length + 1,
		"numNews": updated.length
	}
	writeJSONToFile(file, [logItem, ...logs])
});

// cron.schedule(' 0 0 * * *', async () => {
// 	const date = new Date();
// 	console.log(`Created new json store file ${date.toLocaleString('sv-SE')}.json`);
// 	fs.appendFile(`${date.toLocaleString('sv-SE')}.json`, JSON.stringify([], (err) => {
// 		if (err) {
// 			console.error('Error writing file:', err);
// 		} else {
// 			console.log('File written successfully');
// 		}
// 	}))
// })

cron.schedule('*/10 * * * *', async () => {
	const date = new Date()
	const file = `data/logs/jnDev/cron/${date.toLocaleDateString('sv-SE')}.json`
	const logs = readJSONFromFile(file)
	await visitjnDev();
	const logItem = {
		"time": date.toLocaleTimeString('sv-SE'),
		"count": logs.length + 1
	}
	writeJSONToFile(file, [logItem, ...logs])
	// console.log('visited')
})
