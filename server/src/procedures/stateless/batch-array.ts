export const batchArray = <T>(params: {
	array: T[];
	batchSize: number;
}) => {
	const batches: T[][] = [];
	for (let i = 0; i < params.array.length; i += params.batchSize) {
		batches.push(params.array.slice(i, i + params.batchSize));
	}
	return batches;
};
