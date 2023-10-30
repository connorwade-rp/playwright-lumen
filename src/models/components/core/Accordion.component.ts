import { PanelsComponent } from "../types";

class AccordionComponent {
	readonly cont = ".cmp-accordion";
	readonly headers = ".cmp-accordion__header";
	readonly buttons = ".cmp-accordion__button";
	readonly panels: PanelsComponent[];

	constructor(panels?: PanelsComponent[]) {
		if (panels) {
			this.panels = panels;
		}
	}
}

export default AccordionComponent;
