import { defineStore } from 'pinia';

export const useRouterStore = defineStore("routerStore", {
	state: () => ({
		canGoBack: false,
		routes: [
			{ path: '', component: "Main" },
		]
	})
});