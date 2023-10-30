import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type AxeFixture = {
	makeAxeBuilder: () => AxeBuilder;
};

export const axeTest = base.extend<AxeFixture>({
	makeAxeBuilder: async ({ page }, use, testinfo) => {
		const makeAxeBuilder = () => new AxeBuilder({ page });
		// .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		// .exclude('selector-for-ignored-element')

		await use(makeAxeBuilder);
	},
});

export { expect } from "@playwright/test";
