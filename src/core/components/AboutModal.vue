<template>
	<v-dialog v-model="localIsActive" max-width="400">
		<v-card class="mx-auto" :prepend-avatar="windowIcon" :subtitle="description" width="100%">
			<template v-slot:title>
				<div class="font-weight-black about__title">
					<div class="about__title__name">
						{{ programName }}
					</div>
					<v-chip class="about__title__version">
						{{ version }}
					</v-chip>
				</div>
			</template>

			<v-card-text class="bg-surface-light pt-4">
				<div class="about__list" lines="one">
					<v-list-item v-for="(item, index) in listItems" :key="index">
						<v-list-item-content>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
							<v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</div>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click="localIsActive = false">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import packageJson from "../../../package.json";
import { useMainStore } from "../../inc/store/mainStore";

export default {
	props: {
		isActive: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			windowIcon: document.querySelector("link[rel*='icon']").href
		}
	},
	setup(props) {
		const localIsActive = ref(props.isActive);
		const listItems = ref([]);
		const programName = ref("");
		const version = ref("");
		const description = ref("");

		const mainStore = useMainStore();

		const getListItems = async () => {
			const { electronVersion, chromiumVersion, nodejsVersion, v8Version, osInfo } = await window.electronAPI.getVersions();
			listItems.value = [
				{ title: "Electron", subtitle: electronVersion },
				{ title: "Chromium", subtitle: chromiumVersion },
				{ title: "Node.js", subtitle: nodejsVersion },
				{ title: "V8", subtitle: v8Version },
				{ title: "OS", subtitle: osInfo },
			];
		};

		const loadPackageJson = () => {
			programName.value = packageJson.name;
			version.value = packageJson.version;
			description.value = packageJson.description;
		};

		const closeModal = () => {
			localIsActive.value = false;
		};

		watch(() => props.isActive, (newVal) => {
			localIsActive.value = newVal;
		});

		watch(() => localIsActive.value, (newVal) => {
			mainStore.activeAboutModal = newVal;
		});

		onMounted(() => {
			getListItems();
			loadPackageJson();
		});

		return {
			localIsActive,
			listItems,
			programName,
			version,
			description,
			closeModal
		};
	}
}
</script>
<style scoped>
.about__title {
	display: flex;
	align-items: center;
	gap: 10px;
}

.about__list {
	background: none !important;
	padding: 0px;
	border: 0px;
	box-shadow: none;
}

.about__list .v-list-item {
	padding: 0px !important;
}

.about__list .v-list-item-title {
	margin-bottom: 5px;
}

.about__list {
	display: flex;
	gap: 20px;
	flex-direction: column;
}

.about__title__name {
	text-transform: capitalize;
}
</style>