import ButtonComponent from "./core/Button.component";
import ImageComponent from "./core/Image.component";

export type AllowedComponent = ImageComponent | ButtonComponent | string;

export type PanelsComponent = {
	cont: string;
	children: AllowedComponent[];
};
