import  supabase  from '../config/supabase.js';

export const store = async (newData) => {
	// console.log('store to supabase')
	const { data, error } = await supabase
		.from('svt-latest-news')
		.insert(newData)		
	if(error) {
		console.error('error', error);
		const date = new Date()
		const file = `data/logs/supabase/errors.json`
		const logs = readJSONFromFile(file)
		const logItem = {
			"time": `${date.toLocaleDateString('sv-SE')}-${date.toLocaleTimeString('sv-SE')}`,
			"error": error
		}
		writeJSONToFile(file, [logItem, ...logs])
	}
}