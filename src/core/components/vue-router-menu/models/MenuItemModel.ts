export interface MenuItemModel {
	id?: string;
	anchor: string;
	name?: string;
	extra?: any;
	icon?: string;
	onSelected?: (anchor: string, name?: string, checked?: boolean, extra?: any) => void;
	menu?: MenuItemModel[];
	disable?: boolean;
	highlight?: boolean;
	isDivider?: boolean;
	shortcut?: Array<string>;
	isNotExecutableShortcut?: boolean;
	checked?: boolean;
}