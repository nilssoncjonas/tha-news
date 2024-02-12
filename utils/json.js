import * as fs from 'fs';

export const readJSONFromFile = (filePath) => {
	if (!fs.existsSync(filePath)) {
		try {
			fs.writeFileSync(filePath, '[]', 'utf8');
		} catch (error) {
			console.log(`[ERROR]: creating file: ${filePath}`)
		}
	}
	try {
		const jsonData = fs.readFileSync(filePath);
		return JSON.parse(jsonData);
	} catch (error) {
		console.log(`[ERROR]: reading file: ${filePath}`)
		return [];
	}
};

export const writeJSONToFile = (filePath, data) => {
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.log(`[ERROR]: reading file: ${filePath}`)
	}
};

// npm fs-extra ?