import  supabase  from '../config/supabase.js';

export const store = async (newData) => {
	console.log('store to supabase')
	const { data, error } = await supabase
		.from('svt-latest-news')
		.insert(newData)		
	if (error) console.error('error', error);
}