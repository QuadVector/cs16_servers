<template>
	<div class="component__WindowBar">
		<v-app-bar class="component__WindowBar__bar" density="compact">
			<template v-slot:prepend>
				<img :src="windowIcon" class="component__WindowBar-icon" alt="" v-if="showIcon" />
				<div class="component__WindowBar-buttons">
					<v-btn prepend-icon="mdi-arrow-left" @click="this.$router.go(-1)"
						:disabled="!this.routerStore.canGoBack" variant="text"
						class="component__WindowBar-buttons-btn component__WindowBar-btn__back"></v-btn>
					<v-btn prepend-icon="$menu" variant="text"
						class="component__WindowBar-buttons-btn component__WindowBar-btn__menu"
						@click="this.routerStore.navigatorOpened = !this.routerStore.navigatorOpened"></v-btn>
				</div>
				<MainMenu />
			</template>

			<v-app-bar-title class="component__WindowBar-title text-center">
				{{ windowTitle }}
			</v-app-bar-title>
		</v-app-bar>
	</div>
</template>

<script>
import MainMenu from "/src/core/components/MainMenu.vue";
import { useRouterStore } from "../../inc/store/routerStore";

export default {
	data() {
		return {
			windowTitle: document.title,
			windowIcon: document.querySelector("link[rel*='icon']").href,
			showIcon: true,
		};
	},
	created() {
		this.routerStore = useRouterStore();
	},
	components: { MainMenu },
};
</script>
