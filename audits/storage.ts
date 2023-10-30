import * as fs from "node:fs";
import * as path from "node:path";

export let auditStorage: StoragePage[] = [];
let performanceReportPath = path.join(__dirname, "performance", "report.json");

export type StoragePage = {
  siteUrl: string;
  reportUrl: string;
  fileName: string;
  device: string;
  lh?: {
    performance?: number | null;
    accessibility?: number | null;
    bestPractices?: number | null;
    seo?: number | null;
    pwa?: number | null;
  };
};

export function addPageToStorage(storagePage: StoragePage) {
  for (let i = 0; i < auditStorage.length; i++) {
    let page = auditStorage[i];
    if (storagePage.reportUrl === page.reportUrl) {
      console.log(`Overwriting ${page.reportUrl}`);
      auditStorage[i] = storagePage;
      return auditStorage;
    }
  }

  auditStorage.push(storagePage);
  return auditStorage;
}

export function performanceReportExists() {
  return fs.existsSync(performanceReportPath);
}

export function initializeStorage() {
  console.log("Setting storage");
  if (!performanceReportExists()) {
    console.log("No previous data found, starting from fresh");
  } else {
    const file = readStorage();
    auditStorage = JSON.parse(file);
  }
}

export function finalizeStorage() {
  fs.writeFileSync(performanceReportPath, JSON.stringify(auditStorage));
}

export function readStorage() {
  return fs.readFileSync(performanceReportPath, "utf-8");
}
