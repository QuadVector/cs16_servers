<template>
	<div class="workspace-content inner-padding text-center content-center overflow-hidden">
		<div>
			<h1>Welcome to the main page of the fluent app!</h1>
			<h2>Navigator paged app template</h2>

			<div class="logos">
				<img src="../../public/img/electron.svg" />
				<img src="../../public/img/vue.svg" />
				<img src="../../public/img/vite.svg" />
				<img src="../../public/img/pinia.svg" />
				<img src="../../public/img/vuetify.svg" />
				<img src="../../public/img/typescript.svg" />
			</div>

			<div>
				<p>
					This is a demonstration app which can show you the main
					features of this project template. It is not a production
					ready app, you can edit it and make it your own based on the
					template.
				</p>
				<p>
					This Electron project uses:
					<i>Typescript, Vue, Vite, Pinia</i>. Main components based
					on <i>Vuetify</i>.
				</p>
				<p>
					In this window you can see two menus: one horizontal menu on
					the title bar of the window, and one vertical menu on the
					left side of the window. You can move between pages by
					clicking on the menu items on the left navigation menu.
					Click on the "back" button with the arrow icon to return to
					the previous page.
				</p>
				<p>
					On the "Components" page you can see basic examples of UI.
				</p>
				<p>
					The "About" page contains information about the project and
					other system information.
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {},
};
</script>

<style scoped>
.logos {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	margin: 20px auto;
	justify-content: center;
}

.logos img {
	max-width: 100px;
	max-height: 100px;
}
</style>