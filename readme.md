## RP's Playwright Template

## How to Use

### Setup and install

It is best to use `pnpm` as the package manager tool. You can probably get away with using `npm`, but please do not commit any code that uses a npm lock or yarn lock file.

Install dependencies with `pnpm install`

### URL's

Set your URL's via the `rp.config.ts` file. This will set your urls for the entire project

```json
const rpConfig = {
	envs: {
		local: "http://localhost:4502",
		qa: "https://qa.comp.com",
		stage: "https://stage.comp.com",
		disp: "http://www-disp.comp.com",
		prod: "https://www.example.com",
	},
	defaultEnv: "prod",
};
```

When you run the code, the configuration will be set for you.

If you want to set the URL via the command-line use:

```bash
ENV=local|qa|stage|disp|prod <command>
```

### Auditors

This code has auditing processes for performance and accessibility. The performance code uses lighthouse. The accessibility code uses Axetools.

There are three main pnpm commands:

```bash
pnpm audit:check #check performance and accessibility
pnpm audit:perf #check only performance
pnpm audit:access #check only accessibility
```

In addition to these commands, there are a number of flags that can be set.

```bash
pnpm audit:check -a | --all #check all urls under utils/urls/lighthouseUrls.ts
pnpm audit:check -p=<path> | --path=<path> #check the specified path on the site i.e. <domain>/path
pnpm audit:check -d="<device>" | --device="<device>" #set the device emulator for the chromium browser
```

The auditor will collect performance data and condense it into a report. You can use this command to serve the report using the server:

```bash
pnpm audit:report
```
