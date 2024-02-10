import * as fs from 'fs';

export const readJSONFromFile = (filePath) => {
	try {
		const jsonData = fs.readFileSync(filePath);
		return JSON.parse(jsonData);
	} catch (error) {
		return [];
	}
};

export const writeJSONToFile = (filePath, data) => {
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};