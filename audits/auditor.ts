import { Browser, BrowserContext, chromium, devices } from "@playwright/test";
import config from "../playwright.config";
import { lighthouseUrls } from "../src/utils/urls/index";
import { performanceAudit } from "./lighthouse";
import { accessibilityAudit } from "./accessibility";
import { getNextOpenPort } from "../src/utils/getPort";
import { auditStorage, finalizeStorage, initializeStorage } from "./storage";

const pathIndex = process.argv.findIndex((arg) =>
  /(?:-p|--path)=\/\S*/.test(arg)
);
const pathSet = pathIndex > 0;

const allIndex = process.argv.findIndex((arg) => /(?:-a|--all)/.test(arg));
const allSet = allIndex > 0;

const deviceIndex = process.argv.findIndex((arg) =>
  /(?:-d|--device)=.*/.test(arg)
);

const deviceSet =
  deviceIndex > 0 &&
  Object.keys(devices).includes(process.argv[deviceIndex].split("=")[1]);

const perfIndex = process.argv.findIndex((arg) => /(--perf)/.test(arg));
const accessIndex = process.argv.findIndex((arg) => /(--access)/.test(arg));
const perfSet = !(accessIndex > 0); //performance isn't set if access is
const accessSet = !(perfIndex > 0); //access isn't set if performance is

!(pathSet || allSet) && console.log("No path detected. Setting to default '/'");
!deviceSet && console.log("Device not set - running against Desktop Chrome");
allSet && console.log("Running against all paths");
perfSet && !accessSet && console.log("Lighthouse only audit");
accessSet && !perfSet && console.log("Axetools only audit");

const args = {
  path: pathSet ? process.argv[pathIndex].split("=")[1] : "/",
  device: deviceSet
    ? process.argv[deviceIndex].split("=")[1]
    : "Desktop Chrome",
};

const perfDir = "./audits/performance";
const accessDir = "./audits/accessibility";

const baseUrl = config.use?.baseURL;
const allPaths = lighthouseUrls;
const paths = allSet ? allPaths : [args.path];

async function initBrowser(browserPort): Promise<Browser> {
  return await chromium.launch({
    args: [`--remote-debugging-port=${browserPort}`],
  });
}

async function initContext(browser: Browser): Promise<BrowserContext> {
  return await browser.newContext(devices[args.device]);
}

async function audit() {
  initializeStorage();

  const browserPort = await getNextOpenPort();
  const browser = await initBrowser(browserPort);
  const ctx = await initContext(browser);

  for (const path of paths) {
    const url = baseUrl + path;
    const page = await ctx.newPage();

    await page.goto(url);

    perfSet && (await performanceAudit(url, path, browserPort, perfDir, args));
    accessSet && (await accessibilityAudit(path, accessDir, args));

    await page.close();
  }
  await ctx.close();
  await browser.close();

  console.log(auditStorage);
  finalizeStorage();
}

audit()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
