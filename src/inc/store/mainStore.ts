import { defineStore } from 'pinia';

export const useMainStore = defineStore('mainStore', {
	state: () => ({
		activeAboutModal: false
	})
});