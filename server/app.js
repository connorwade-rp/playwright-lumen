const express = require("express");
const path = require("node:path");
const { cwd } = require("node:process");
const fs = require("node:fs");
const app = express();
const port = 3333;

const reportDist = path.join(__dirname, "dist");
const lighthouseReports = path.join(cwd(), "audits", "performance");

app.use((req, res, next) => {
	console.log(req.url);
	next();
});

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/dist/index.html`);
});

app.use(express.static(reportDist));
app.use("/lighthouse-reports", express.static(lighthouseReports));

app.listen(port, () => {
	console.log(`Opened report on: http://localhost:${port}`);
});
