import * as fs from "node:fs";
// import lighthouse from "lighthouse";
import * as pathing from "node:path";
import { addPageToStorage, auditStorage } from "./storage";

export async function performanceAudit(
  url: string,
  path: string,
  browserPort: number,
  resultsDir: string,
  args
) {
  // TODO: Fix lighthouse imports and typing
  const lighthouseImport = await import("lighthouse");
  const lighthouse = lighthouseImport.default;

  // TODO: Fix typing
  // const flags = {
  //   logLevel: "info",
  //   output: "html",
  //   port: browserPort,
  // };

  const runnerResult = await lighthouse(url, {
    logLevel: "info",
    output: "html",
    port: browserPort,
    screenEmulation: { disabled: true },
  });

  if (!runnerResult) {
    console.log("Error: Runner Result undefined");
    return;
  }

  const reportHtml = runnerResult.report as string;

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  let fileName = path === "/" ? "home" : path.slice(1).replace("/", "-");
  if (pathing.extname(fileName) === ".html") {
    fileName = fileName.replace(".html", "");
  }

  let devicePath = args.device.replace(" ", "");

  fs.writeFileSync(
    `${resultsDir}/lighthouse-${fileName}-${devicePath}.html`,
    reportHtml
  );

  runnerResult.lhr.categories.performance.score ??= 0;
  runnerResult.lhr.categories.accessibility.score ??= 0;
  runnerResult.lhr.categories.seo.score ??= 0;
  runnerResult.lhr.categories["best-practices"].score ??= 0;

  console.log(
    "Lighthouse Report is done for",
    runnerResult.lhr.mainDocumentUrl
  );
  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100
  );

  addPageToStorage({
    siteUrl: path,
    reportUrl: `/lighthouse-${fileName}-${devicePath}.html`,
    fileName: fileName,
    device: devicePath,
    lh: {
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
      bestPractices: runnerResult.lhr.categories["best-practices"].score * 100,
    },
  });
}
