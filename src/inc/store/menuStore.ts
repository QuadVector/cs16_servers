import { defineStore } from "pinia";

interface IMenuItem {
	anchor: string;
	name?: string;
	extra?: any;
	icon?: string;
	checked?: boolean;
	disable?: boolean;
	shortcut?: Array<string>;
	notExecutableShortcut?: boolean;
	menu?: IMenuItem[];
}

export const useMenuStore = defineStore("menuStore", {
	state: () => ({
		// main menu items (horizontal window menu)
		mainMenuItems: [
			{
				anchor: "menu-file",
				name: "File",
				menu: [
					{
						anchor: "app-close",
						name: "Close",
						shortcut: ["Alt+F4"],
						icon: `
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z"/></svg>
						`
					}
				]
			},
			{
				anchor: "menu-view",
				name: "View",
				menu: [
					{
						anchor: "color-theme",
						name: "Color theme",
						menu: [
							{
								anchor: "color-theme-light",
								name: "Light",
								checked: localStorage.getItem("current_theme_mode") === "light"
							},
							{
								anchor: "color-theme-dark",
								name: "Dark",
								checked: localStorage.getItem("current_theme_mode") === "dark"
							},
							{
								anchor: "color-theme-system",
								name: "System",
								checked: localStorage.getItem("current_theme_mode") === "system" || localStorage.getItem("current_theme_mode") === null
							}
						]
					}
				]
			},
			{
				anchor: "menu-help",
				name: "Help",
				menu: [
					{
						anchor: "help-about",
						name: "About",
						routePath: "/about",
						shortcut: ["F1"],
						icon: `
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
						`
					}
				]
			}
		]
	}),
	getters: {
		AnchorExecutableShortcuts: (state) => {
			const result: { anchor: string; shortcut: Array<string> }[] = [];
			const recursiveSearch = (items: IMenuItem[]) => {
				items.forEach((item) => {
					if (item.shortcut && !item.notExecutableShortcut) {
						result.push({
							anchor: item.anchor,
							shortcut: item.shortcut
						});
					}
					if (item.menu) {
						recursiveSearch(item.menu);
					}
				});
			};
			recursiveSearch(state.mainMenuItems);
			return result;
		},
		AnchorShortcuts: (state) => {
			const result: { anchor: string; shortcut: Array<string> }[] = [];
			const recursiveSearch = (items: IMenuItem[]) => {
				items.forEach((item) => {
					if (item.shortcut) {
						result.push({
							anchor: item.anchor,
							shortcut: item.shortcut
						});
					}
					if (item.menu) {
						recursiveSearch(item.menu);
					}
				});
			};
			recursiveSearch(state.mainMenuItems);
			return result;
		}
	},
	actions: {
		/**
		 * Changes the state of the element with the given anchor
		 * @param elementAnchor the anchor of the element to change
		 * @param changeItems an object with the properties to change and their new values
		 */
		ChangeElementState(elementAnchor: string, changeItems: { [key: string]: any }): void {
			/**
			 * Recursively searches for an item with the given anchor
			 * @param items the items to search in
			 * @returns the found item or undefined
			 */
			const recursiveFind = (items: IMenuItem[]): IMenuItem | undefined => {
				for (const item of items) {
					if (item.anchor === elementAnchor) {
						return item;
					}

					if (item.menu) {
						const foundItem = recursiveFind(item.menu);
						if (foundItem) {
							return foundItem;
						}
					}
				}

				return undefined;
			};

			const foundItem = recursiveFind(this.mainMenuItems);
			if (foundItem) {
				/**
				 * Updates the properties of the found item
				 */
				for (const key in changeItems) {
					if (Object.prototype.hasOwnProperty.call(changeItems, key)) {
						(foundItem as any)[key] = changeItems[key];
					}
				}
			}
		},

		/**
		 * Creates a new menu item with the given config and adds it to the menu item with the given parent id
		 * @param config the config of the new item
		 * @param parentId the anchor of the parent item
		 */
		CreateElement(config: IMenuItem, parentId: string): void {
			/**
			 * Adds a new item to the given list of items
			 * @param items the list of items to add to
			 */
			const addItem = (items: IMenuItem[]) => {
				items.push(config);
			};

			/**
			 * Recursively searches for the parent item and adds the new item to its menu
			 * @param items the list of items to search in
			 */
			const recursiveAdd = (items: IMenuItem[]) => {
				for (const item of items) {
					if (item.anchor === parentId) {
						if (!item.menu) {
							item.menu = [];
						}
						addItem(item.menu);
						return;
					} else if (item.menu) {
						recursiveAdd(item.menu);
					}
				}
			}

			recursiveAdd(this.mainMenuItems);
		},
		/**
		 * Deletes the menu item with the given anchor
		 * @param elementAnchor the anchor of the item to delete
		 */
		DeleteElement(elementAnchor: string): void {
			/**
			 * Recursively deletes the item with the given anchor from the given list of items
			 * @param items the list of items to delete from
			 */
			function recursiveDelete(items: IMenuItem[]) {
				for (let i = items.length - 1; i >= 0; i--) {
					if (items[i].anchor === elementAnchor) {
						items.splice(i, 1);
					} else if (items[i].menu) {
						recursiveDelete(items[i].menu!);
						if (items[i] && items[i].menu?.length === 0) {
							delete items[i].menu;
						}
					}
				}
			}

			recursiveDelete(this.mainMenuItems);
		}
	}
});
