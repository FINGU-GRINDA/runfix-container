const getPage = async (params: { page: number }) => {
	const offset = (params.page - 1) * 50;
	const res = await fetch(
		`https://growjo.com/api/companies?order=asc&orderBy=ranking&offset=${offset}&rowsPerPage=50&filter=%7B%7D`,
		{
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				auth: "Basic Z3Jvd2pvQXBpVXNlcjpqazYhNVo5UHViQi5Idlo=",
				"cache-control": "no-cache",
				pragma: "no-cache",
				"sec-ch-ua":
					'"Microsoft Edge";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Linux"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
			},
			referrer: "https://growjo.com/",
			referrerPolicy: "strict-origin-when-cross-origin",
			body: null,
			method: "GET",
			mode: "cors",
			credentials: "include",
		},
	);

	const data = await res.json();

	return data;
};

const isFileExists = async (params: { fileName: string }) => {
	const file = Bun.file(params.fileName);
	return await file.exists();
};

const main = async () => {
	const saveDir = "./.data";
	let page = 1;
	console.log("Fetching data...");
	while (true) {
		const data = await getPage({ page });
		const fileName = `companies-${page}.json`;
		const fullPath = `${saveDir}/${fileName}`;
		page++;

		if (await isFileExists({ fileName: fullPath })) {
			console.log(`File ${fileName} already exists`);
			continue;
		}

		Bun.write(fullPath, JSON.stringify(data));

		if (data.data.length < 50) {
			break;
		}
	}
	console.log("Completed fetching data");
};

main();
