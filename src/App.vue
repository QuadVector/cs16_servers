<template>
	<v-app id="app__container">
		<WindowBar />
		<AboutModal :isActive="displayAboutModal" />
		<v-main class="app__content">
			<v-navigation-drawer v-model="navigatorOpened" floating :mobile-breakpoint="800">
				<v-list v-model:selected="navigatorSelectedItem" @update:selected="setnavigatorSelectedItem">
					<v-list-item v-for="(item, i) in navigatorMenuItems" :key="i" :value="item.routePath"
						:title="item.title" :prepend-icon="item.icon" :active="this.$router.currentRoute.value.path.toLowerCase() ===
							item.routePath.toLowerCase()">
					</v-list-item>
				</v-list>
			</v-navigation-drawer>
			<div class="app__workspace">
				<router-view v-slot="{ Component, route }">
					<transition name="scale-slide">
						<keep-alive>
							<component :is="Component" :key="route.path" />
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</v-main>
	</v-app>
</template>

<script>
import WindowBar from "./core/components/WindowBar.vue";
import AboutModal from "./core/components/AboutModal.vue";
import { useRouterStore } from "./inc/store/routerStore";
import { useMainStore } from "./inc/store/mainStore";
import "./core/styles/app.css";

export default {
	components: {
		WindowBar,
		AboutModal
	},
	computed: {
		displayAboutModal() {
			const mainStore = useMainStore();
			return mainStore.activeAboutModal;
		},

		navigatorMenuItems() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorMenuItems) {
				return routerStore.navigatorMenuItems;
			}
			return [];
		},
		navigatorSelectedItem() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorSelectedItem) {
				return routerStore.navigatorSelectedItem;
			}
			return [];
		},
		navigatorOpened() {
			const routerStore = useRouterStore();
			if (routerStore.navigatorOpened) {
				return routerStore.navigatorOpened;
			}
			return false;
		},
	},
	methods: {
		setnavigatorSelectedItem(routeName) {
			if (routeName[0]) {
				this.$router.push(routeName[0]);
			}
		},
		appResize() {
			const routerStore = useRouterStore();
			if (window.innerWidth > 799) {
				routerStore.navigatorOpened = true;
			} else {
				routerStore.navigatorOpened = false;
			}
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