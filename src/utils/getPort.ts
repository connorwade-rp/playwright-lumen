import * as net from "node:net";

const isPortOpen = async (port: number): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		let server = net.createServer();
		server.once("error", (err) => {
			resolve(err["code"] !== "EADRINUSE");
		});
		server.once("listening", () => {
			resolve(true);
			server.close();
		});
		server.listen(port);
	});
};

export const getNextOpenPort = async (startFrom: number = 2222) => {
	let openPort: number = null;
	while (startFrom < 65535 || !!openPort) {
		if (await isPortOpen(startFrom)) {
			openPort = startFrom;
			break;
		}
		startFrom++;
	}
	return openPort;
};
