import { PanelsComponent } from "../types";

class TabsComponent {
	readonly cont = ".cmp-tabs";
	readonly tabList = "cmp-tabs__tablist";
	readonly tabListItems = ".cmp-tabs__tabs";
	readonly activeItem = ".cmp-tabs__tab--active";
	readonly activePanels = ".cmp-tabs__tabpanel--active";
	readonly panels: PanelsComponent[];

	constructor(panels?: PanelsComponent[]) {
		if (panels) {
			this.panels = panels;
		}
	}
}

export default TabsComponent;
