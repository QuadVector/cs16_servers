import { defineStore } from 'pinia';

export const useRouterStore = defineStore("routerStore", {
	state: () => ({
		canGoBack: false,
		navigatorOpened: true,
		routes: [
			{ path: '', component: "Main" },
			{ path: '/components', component: "Components" },
			{ path: '/grid', component: "Grid" },
		],
		//dock menu items (navigator menu)
		navigatorMenuItems: [
			{ title: "Welcome", routePath: "/", icon: "mdi-home" },
			{ title: "Components", routePath: "/components", icon: "mdi-wrench" },
			{ title: "Grid", routePath: "/grid", icon: "mdi-table" },
		],
	})
});