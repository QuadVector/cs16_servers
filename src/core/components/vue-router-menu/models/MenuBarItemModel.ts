import { MenuItemModel } from './MenuItemModel';

export interface MenuBarItemModel {
	id?: string;
	anchor: string;
	name?: string;
	extra?: any;
	icon?: string;
	onSelect?: (anchor: string, name?: string, checked?: boolean, extra?: any) => void;
	menu?: MenuItemModel[];
	showMenu?: boolean;
	shortcut?: Array<string>;
	checked?: boolean;
}