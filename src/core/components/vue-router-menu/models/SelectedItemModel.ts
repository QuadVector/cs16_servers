export interface SelectedItemModel {
	id?: string;
	anchor: string;
	name?: string;
	extra?: any;
	event?: MouseEvent | KeyboardEvent | TouchEvent;
	isParent?: boolean;
	disable?: boolean;
	checked?: boolean;
}