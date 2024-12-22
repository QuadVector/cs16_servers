<template>
	<div :class="[dockClass, 'menu-wrapper']" :style="{ background: theme.secondary }">
		<ul ref="menuItemsRef" class="menu-items" tabindex="0" @keyup.up="handleKeyUp" @keyup.down="handleKeyDown"
			@keyup.left="
				dock === 'RIGHT' ? handleKeyRight($event) : handleKeyLeft($event)
				" @keyup.right="
					dock === 'RIGHT' ? handleKeyLeft($event) : handleKeyRight($event)
					" @focus="onFocus" @blur="onBlur" @keyup.enter="handleKeySelection">
			<li v-for="(item, index) of menuItems" :key="item.id" :class="[
				dockClass,
				'menu-item',
				{
					'is-parent': !!item.menu,
					highlight: index === highlightedIndex,
					divider: item.isDivider,
					disable: item.disable,
				},
			]" :style="menuItemStyle" @mouseenter="
				item.menu && !isMobile && toggleSubMenu(!!item.menu, item.id)
				" @mouseleave="
					item.menu && !isMobile && toggleSubMenu(!!item.menu, item.id)
					" @click="
						handleSelection({
							event: $event,
							id: item.id,
							anchor: item.anchor,
							checked: item.checked || false,
							name: item.name,
							extra: item.extra,
							isParent: !!item.menu,
							disable: item.disable,
						})
						" @touchend="
							handleSelection({
								event: $event,
								id: item.id,
								anchor: item.anchor,
								checked: item.checked || false,
								name: item.name,
								extra: item.extra,
								isParent: !!item.menu,
								disable: item.disable,
							})
							">
				<template v-if="!item.isDivider">
					<span v-if="item.checked" class="menu-item-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path
								d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
						</svg>
					</span>
					<span v-if="item.icon && !item.checked" :innerHTML="item.icon" class="menu-item-icon"></span>
					<span class="name">{{ item.name }}</span>
					<span class="shortcut" v-if="item.shortcut">
						{{
							item.shortcut[0].replaceAll('$mod', 'Ctrl')
						}}
					</span>
					<span :class="{ visible: !!item.menu }" v-if="!item.shortcut" class="menu-item-arrow">
						<ChevRight />
					</span>
					<div v-if="item.menu && showSubMenu && item.id === activeMenuId"
						:class="[dockClass, 'sub-menu-wrapper']">
						<component :is="MenuComponent" :items="item.menu" :dock="dock"
							:parent="`${parent}>${item.name}`" :theme="theme" :is-touch="isMobile" :nested="true"
							:on-selected="onSelected" :initial-highlight-index="subMenuHighlightIndex"
							@close-menu="handleCloseMenu">
						</component>
					</div>
				</template>
				<span v-else class="menu-item-divider" />
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import MenuBarDockPosition from "../models/MenuBarDockPosition";
import { MenuItemModel } from "../models/MenuItemModel";
import {
	defineComponent,
	PropType,
	resolveComponent,
	ref,
	computed,
	onMounted,
	nextTick,
} from "vue";
import ChevRight from "./ChevRight.vue";
import { SelectedItemModel } from "../models/SelectedItemModel";
import { MenuTheme } from "../models/Theme";

export default defineComponent({
	name: "DockMenu",
	components: {
		ChevRight,
	},
	props: {
		items: {
			type: Array as PropType<MenuItemModel[]>,
			default: [] as MenuItemModel[],
			required: true,
		},
		dock: {
			required: false,
			default: MenuBarDockPosition.TOP,
			type: String,
		},
		parent: {
			required: false,
			default: "",
			type: String,
		},
		theme: {
			required: true,
			type: Object as PropType<MenuTheme>,
		},
		isMobile: {
			type: Boolean,
			default: false,
		},
		nested: {
			type: Boolean,
			default: false,
		},
		onSelected: {
			required: true,
			type: Function as PropType<
				({ anchor, name, checked, extra }: { anchor: string, name: string, checked: boolean, extra: any }) => void
			>,
		},
		initialHighlightIndex: {
			required: false,
			type: Number,
			default: -1,
		},
	},
	emits: ["selected", "close-menu"],
	setup(props, { emit }) {
		const MenuComponent = resolveComponent("DockMenu");

		const showSubMenu = ref();

		const activeMenuId = ref();

		const dockClass = computed(() => props.dock.toLowerCase());

		const toggleSubMenu = (hasData: boolean, id: string) => {
			if (hasData) {
				if (!showSubMenu.value) {
					activeMenuId.value = id;
				} else {
					activeMenuId.value = null;
				}
				showSubMenu.value = !showSubMenu.value;
			}
		};

		const hasFocus = ref<boolean>();

		const menuItemsRef = ref();
		const highlightedIndex = ref<number>(props.initialHighlightIndex);
		const subMenuHighlightIndex = ref(-1);

		const handleSelection = (selectedItem: SelectedItemModel) => {
			selectedItem.event?.stopPropagation();
			selectedItem.event?.preventDefault();

			if (selectedItem.disable) {
				return;
			}

			if (selectedItem.isParent) {
				showSubMenu.value = !showSubMenu.value;
				return;
			}

			const { anchor, name, checked, extra } = selectedItem;

			props.onSelected({
				anchor,
				name,
				checked,
				extra
			});
		};

		const menuItemStyle = computed(() => ({
			"--background-color-hover": props.theme.tertiary,
			"--fore-color": props.theme.textColor,
			"--text-hover-color": props.theme.textHoverColor,
		}));

		const menuItems = ref(
			props.items.map((item) =>
				Object.assign({}, item, {
					id: Math.random().toString(16).slice(2),
					showSubMenu: false,
				})
			)
		);

		const menuItemsLen = computed(() => menuItems.value.length);

		onMounted(() => {
			nextTick(() => {
				(menuItemsRef.value as HTMLElement).focus();
			});
		});

		const focusMenuBar = () => {
			const menuBarItems = (menuItemsRef.value as HTMLElement).closest(
				".menu-bar-item-container"
			);
			if (menuBarItems) {
				(menuBarItems as HTMLElement).focus();
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (!hasFocus.value) {
				return;
			}
			event.stopPropagation();
			let nextIndex = highlightedIndex.value - 1;
			nextIndex = menuItems.value[nextIndex]?.isDivider
				? nextIndex - 1
				: nextIndex;

			if (nextIndex >= 0) {
				highlightedIndex.value = nextIndex;
			} else if (nextIndex < 0) {
				highlightedIndex.value = menuItemsLen.value - 1;
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!hasFocus.value) {
				return;
			}
			event.stopPropagation();
			let nextIndex = highlightedIndex.value + 1;
			nextIndex = menuItems.value[nextIndex]?.isDivider
				? nextIndex + 1
				: nextIndex;

			if (nextIndex >= 0 && nextIndex < menuItemsLen.value) {
				highlightedIndex.value = nextIndex;
			} else if (nextIndex > menuItemsLen.value - 1) {
				highlightedIndex.value = 0;
			}
		};

		const handleKeyRight = (event: KeyboardEvent) => {
			if (!hasFocus.value) {
				return;
			}
			const menuItem = menuItems.value[highlightedIndex.value];

			if (menuItem && menuItem.menu) {
				event.stopPropagation();
				subMenuHighlightIndex.value = 0;
				toggleSubMenu(!!menuItem.menu, menuItem.id);
			} else {
				focusMenuBar();
			}
		};

		const handleKeyLeft = (event: KeyboardEvent) => {
			if (!hasFocus.value) {
				return;
			}
			if (props.nested) {
				event.stopPropagation();
				emit("close-menu");
			} else {
				focusMenuBar();
			}
		};

		const handleKeySelection = (event: KeyboardEvent) => {
			if (highlightedIndex.value >= 0) {
				const menuItem = menuItems.value[highlightedIndex.value];
				event.stopPropagation();

				if (menuItem?.menu) {
					subMenuHighlightIndex.value = 0;
					toggleSubMenu(!!menuItem.menu, menuItem.id);

					nextTick(() => {
						(menuItemsRef.value as HTMLElement).focus();
					});
				} else if (menuItem) {
					props.onSelected({
						anchor: menuItem.anchor as string,
						name: menuItem.name as string,
						checked: menuItem.checked || false,
						extra: menuItem.extra as any
					});
				}
			}
		};

		const onFocus = () => (hasFocus.value = true);
		const onBlur = () => (hasFocus.value = false);

		const handleCloseMenu = () => {
			showSubMenu.value = false;
			nextTick(() => {
				(menuItemsRef.value as HTMLElement).focus();
			});
		};

		return {
			MenuComponent,
			activeMenuId,
			dockClass,
			handleCloseMenu,
			handleKeyDown,
			handleKeyLeft,
			handleKeyRight,
			handleKeySelection,
			handleKeyUp,
			handleSelection,
			highlightedIndex,
			menuItemStyle,
			menuItems,
			menuItemsRef,
			onBlur,
			onFocus,
			showSubMenu,
			subMenuHighlightIndex,
			toggleSubMenu,
		};
	},
});
</script>

<style scoped src="./menu.css"></style>
