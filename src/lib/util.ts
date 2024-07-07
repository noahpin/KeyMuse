import paper from "paper";

export function makeid(length: number): string {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export function buildSVGPathFromKeycapData(keycapData: any) {
	return `M${keycapData.x * 54},${keycapData.y * 54}L${
		(keycapData.x + keycapData.w) * 54
	},${keycapData.y * 54}L${(keycapData.x + keycapData.w) * 54},${
		(keycapData.y + keycapData.h) * 54
	}L${keycapData.x * 54},${(keycapData.y + keycapData.h) * 54}Z`;
}
export function svgPathUnion(path1: string, path2: string) {
	const project = new paper.Project();

	// Create layers to organize paths
	const layer1 = new paper.Layer();
	const layer2 = new paper.Layer();

	// Create paths from SVG path strings
	const paperPath1 = new paper.Path(path1);
	const paperPath2 = new paper.Path(path2);

	// Add paths to layers
	layer1.addChild(paperPath1);
	layer2.addChild(paperPath2);

	// Perform boolean union operation
	const unionedPath = paperPath1.unite(paperPath2);

	// Convert resulting path to SVG path string
	const svgString = unionedPath.pathData;

	// Clean up
	paperPath1.remove();
	paperPath2.remove();

	return svgString;
}
