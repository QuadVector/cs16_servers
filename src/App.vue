<template>
	<v-app id="app__container">
		<WindowBar>
			<template #prepend>
				<img
					:src="windowIcon"
					class="component__WindowBar-icon"
					alt=""
				/>
				<MainMenu />
			</template>
		</WindowBar>
		<AboutModal :isActive="displayAboutModal" />
		<v-main class="app__content">
			<div class="app__workspace">
				<router-view v-slot="{ Component, route }">
					<component :is="Component" :key="route.path" />
				</router-view>
			</div>
		</v-main>
	</v-app>
</template>

<script>
import MainMenu from "/src/core/components/MainMenu.vue";
import WindowBar from "./core/components/WindowBar.vue";
import AboutModal from "./core/components/AboutModal.vue";
import { useRouterStore } from "./inc/store/routerStore";
import { useMainStore } from "./inc/store/mainStore";
import "./core/styles/app.css";

export default {
	components: {
		WindowBar,
		AboutModal,
		MainMenu,
	},
	data() {
		return {
			windowIcon: document.querySelector("link[rel*='icon']").href,
			routerStore: useRouterStore(),
		};
	},
	computed: {
		displayAboutModal() {
			const mainStore = useMainStore();
			return mainStore.activeAboutModal;
		},
	},
	mounted() {
		window.addEventListener("resize", this.appResize);
	},
	unmounted() {
		window.removeEventListener("resize", this.appResize);
	},
};
</script>