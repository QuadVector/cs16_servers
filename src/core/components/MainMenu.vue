<template>
	<DockMenu :items="mainMenuItems" :on-selected="menuSelect" class="no-drag component__WindowBar-menu"></DockMenu>
</template>

<script>
import DockMenu from "../../core/components/vue-router-menu/components/MenuBar.vue";
import { useMenuStore } from "../../inc/store/menuStore";
import { menuSelectEvent } from "../../inc/menuEvents";

import { useTinykeys } from 'vue-tinykeys';
export default {
	data() {
		return {};
	},
	components: {
		DockMenu,
	},
	props: {},
	methods: {
		menuSelect(e) {
			console.info("[Selected menu item]", e);
			menuSelectEvent(e, this.$router);
		},
	},
	computed: {
		mainMenuItems() {
			const menuStore = useMenuStore();
			if (menuStore.mainMenuItems) {
				return menuStore.mainMenuItems;
			}
			return [];
		},
	},
	created() {
		useMenuStore().AnchorExecutableShortcuts.forEach((value) => {
			useTinykeys(value.shortcut, () => {
				menuSelectEvent({ anchor: value.anchor }, this.$router);
			});
		});

		//context-menu / window menu switching when one of them is opening
		setTimeout(function () {
			document
				.querySelector(".menu-bar-items")
				.addEventListener("mouseup", function (event) {
					if (event.which == 1) {
						try {
							let contextMenu =
								document.querySelector(".v-contextmenu");
							if (contextMenu) {
								contextMenu.style.display = "none";
							}

							let openedMenus =
								document.querySelectorAll(".menu-container");
							if (openedMenus) {
								openedMenus.forEach(function (value) {
									value.style.display = "block";
								});
							}
						} catch { }
					}
				});

			window.oncontextmenu = function (event) {
				//prevent context menu event inside menu container
				let bounds = event
					.composedPath()
					.includes(
						document.querySelector(".component__WindowBar-menu")
					);

				if (!bounds) {
					try {
						let contextMenu =
							document.querySelector(".v-contextmenu");
						if (contextMenu) {
							contextMenu.style.display = "block";
						}

						let openedMenus =
							document.querySelectorAll(".menu-container");
						if (openedMenus) {
							openedMenus.forEach(function (value) {
								value.style.display = "none";
							});
						}

						document
							.querySelector(
								".menu-bar-item-container:has(.menu-items) .name-container"
							)
							.click();
					} catch { }
				}
			};
		}, 1);
	},
};
</script>