import * as fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { Page, chromium } from "@playwright/test";

async function makeAxeBuilder(page: Page) {
	return new AxeBuilder({ page });
}

export async function accessibilityAudit(path, resultsDir, args) {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	const Axe = await makeAxeBuilder(page);

	const results = await Axe.analyze();

	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir);
	}

	const fileName = path === "/" ? "home" : path.slice(1).replace("/", "-");
	fs.writeFileSync(
		`${resultsDir}/${fileName}-${args.device}.json`,
		JSON.stringify(results, null, 2),
	);

	console.log(`AxeTools Scan is finished for: ${results.url}`);
}
