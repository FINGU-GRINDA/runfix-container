import fs from "node:fs/promises";
import path from "node:path";
import { createObjectCsvWriter } from "csv-writer";

// --- Configuration ---
const dataDir = path.join(__dirname, "./.data");
const outputCsvFile = path.join(dataDir, "all_companies.csv");
const jsonFilePattern = /^companies-\d+\.json$/;

// --- Helper Function: Flatten nested objects ---
const flattenObject = (
	obj: Record<string, unknown>,
	parentKey = "",
	res: Record<string, unknown> = {},
) => {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			if (
				typeof obj[key] === "object" &&
				obj[key] !== null &&
				!Array.isArray(obj[key])
			) {
				// @ts-expect-error type
				flattenObject(obj[key], newKey, res);
			} else {
				res[newKey] = obj[key];
			}
		}
	}
	return res;
};

// --- Main Function ---
async function convertJsonToCsv() {
	console.log("Starting conversion process...");
	console.log(`Input directory: ${dataDir}`);
	console.log(`Output file: ${outputCsvFile}`);

	const allRecords: Record<string, unknown>[] = [];
	const allHeaders = new Set<string>();

	try {
		// 1. Read all files in the data directory
		const files = await fs.readdir(dataDir);
		const jsonFiles = files.filter((file) => jsonFilePattern.test(file));

		if (jsonFiles.length === 0) {
			console.error(
				`No JSON files matching the pattern '${jsonFilePattern}' found in ${dataDir}.`,
			);
			return;
		}
		console.log(`Found ${jsonFiles.length} JSON files to process.`);

		// 2. Process each JSON file
		for (const file of jsonFiles) {
			const filePath = path.join(dataDir, file);
			console.log(`Processing ${file}...`);
			try {
				const fileContent = await fs.readFile(filePath, "utf-8");
				const jsonData = JSON.parse(fileContent);

				// Assuming the main data is under a 'data' key and is an array
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const records = jsonData.data as any[];
				if (!Array.isArray(records)) {
					console.warn(
						`Skipping ${file}: Expected 'data' property to be an array.`,
					);
					continue;
				}

				// 3. Flatten records and collect headers
				for (const record of records) {
					const flatRecord = flattenObject(record);
					allRecords.push(flatRecord);
					for (const header of Object.keys(flatRecord)) {
						allHeaders.add(header);
					}
				}
			} catch (parseError) {
				console.error(`Error parsing JSON from ${file}:`, parseError);
			}
		}

		if (allRecords.length === 0) {
			console.error("No valid records found in any JSON file.");
			return;
		}

		// 4. Prepare CSV Writer
		const sortedHeaders = Array.from(allHeaders).sort();
		const csvWriter = createObjectCsvWriter({
			path: outputCsvFile,
			header: sortedHeaders.map((id) => ({ id, title: id })),
			// Ensure consistency for missing values
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			fieldDelimiter: ",", // Optional: specify delimiter if needed
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			alwaysQuote: true, // Optional: quote all fields
		});

		console.log(`Identified headers: ${sortedHeaders.join(", ")}`);

		// 5. Write to CSV
		await csvWriter.writeRecords(allRecords);
		console.log(
			`Successfully wrote ${allRecords.length} records to ${outputCsvFile}`,
		);
	} catch (error) {
		console.error("An error occurred during the conversion process:", error);
	}
}

// --- Execute ---
convertJsonToCsv();
