<template>
	<div class="workspace-content vertical-scroll inner-padding-horizontal inner-padding-bottom">
		<div class="workspace__title">
			<div class="workspace__title__text">Components</div>
			<div class="workspace__title__actions">
				<v-btn variant="tonal" @click="$router.go(-1)">Back</v-btn>
			</div>
		</div>
		
		<v-container>
			<v-row dense>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Buttons</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="auto">
									<v-btn flat>Default</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="primary">Primary</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="secondary">Secondary</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="success">Success</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="warning">Warning</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="error">Error</v-btn>
								</v-col>
								<v-col cols="auto">
									<v-btn flat color="info">Info</v-btn>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12">
					<v-card flat>
						<v-card-title>Alerts</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12" md="12">
									<v-alert>Default</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="primary">Primary</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="secondary">Secondary</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="success">Success</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="warning">Warning</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="error">Error</v-alert>
								</v-col>
								<v-col cols="12" md="6">
									<v-alert color="info">Info</v-alert>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Login form</v-card-title>
						<v-card-text>
							<v-form>
								<v-row dense>
									<v-col cols="12" md="6">
										<v-text-field clearable variant="solo-filled" label="Login"></v-text-field>
									</v-col>

									<v-col cols="12" md="6">
										<v-text-field label="Password" type="password" variant="solo-filled"
											clearable></v-text-field>
									</v-col>
								</v-row>

								<v-row dense align="center">
									<v-col cols="auto">
										<v-btn flat color="primary">Login</v-btn>
									</v-col>
									<v-col cols="auto">
										<v-btn flat color="secondary">Register</v-btn>
									</v-col>
									<v-spacer></v-spacer>
									<v-col cols="auto">
										<a href="javascript:">Forgot password?</a>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Dialog example</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12">
									<v-dialog max-width="500">
										<template v-slot:activator="{
											props: activatorProps,
										}">
											<v-btn v-bind="activatorProps" color="primary" text="Open Dialog"
												variant="flat"></v-btn>
										</template>

										<template v-slot:default="{ isActive }">
											<v-card title="Dialog">
												<v-card-text>
													Lorem ipsum dolor sit amet,
													consectetur adipiscing elit,
													sed do eiusmod tempor
													incididunt ut labore et
													dolore magna aliqua.
												</v-card-text>

												<v-card-actions>
													<v-spacer></v-spacer>

													<v-btn text="Close Dialog" @click="
														isActive.value = false
														"></v-btn>
												</v-card-actions>
											</v-card>
										</template>
									</v-dialog>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Selects</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="6">
									<v-select label="Select"
										:items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
										variant="solo-filled"></v-select>
								</v-col>
								<v-col cols="6">
									<v-select clearable chips label="Select"
										:items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
										multiple variant="solo-filled"></v-select>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Context menu</v-card-title>
						<v-card-text>
							<v-row dense>
								<v-col cols="12">
									<div v-contextmenu:contextmenu>
										Right click here
									</div>
									<v-contextmenu ref="contextmenu">
										<v-contextmenu-item>
											<v-icon icon="mdi-github"></v-icon>
											GitHub
										</v-contextmenu-item>
										<v-contextmenu-item>
											<v-icon icon="mdi-gitlab"></v-icon>
											GitLab
										</v-contextmenu-item>

										<v-contextmenu-divider />

										<v-contextmenu-submenu title="Item 1">
											<v-contextmenu-item @click="contextMenuTest()">Show
												alert</v-contextmenu-item>

											<v-contextmenu-submenu title="Item 2">
												<v-contextmenu-item>Item 1</v-contextmenu-item>
												<v-contextmenu-item>Item 2</v-contextmenu-item>
											</v-contextmenu-submenu>

											<v-contextmenu-item>Item 3</v-contextmenu-item>
										</v-contextmenu-submenu>

										<v-contextmenu-item disabled>Item 2</v-contextmenu-item>

										<v-contextmenu-divider />

										<v-contextmenu-group>
											<v-contextmenu-item>
												<v-icon icon="mdi-content-copy"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item>
												<v-icon icon="mdi-content-paste"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item disabled>
												<v-icon icon="mdi-content-cut"></v-icon>
											</v-contextmenu-item>
											<v-contextmenu-item>
												<v-icon icon="mdi-delete-outline"></v-icon>
											</v-contextmenu-item>
										</v-contextmenu-group>
									</v-contextmenu>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-title>Sliders</v-card-title>
						<v-card-text>
							<v-row>
								<v-col cols="12" md="4">
									<v-slider color="red" :max="100" thumb-label
										prepend-icon="mdi-volume-high"></v-slider>
								</v-col>
								<v-col cols="12" md="4">
									<v-slider color="green" :max="100" prepend-icon="mdi-alarm"></v-slider>
								</v-col>
								<v-col cols="12" md="4">
									<v-slider color="blue" :max="100" thumb-label
										prepend-icon="mdi-magnify-minus-outline"
										append-icon="mdi-magnify-plus-outline"></v-slider>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card flat>
						<v-card-text>
							Other UI examples you can find in the
							<a target="_blank" href="https://vuetifyjs.com/en/components/all/">documentation.</a>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		contextMenuTest() {
			alert("Test");
		},
	},
};
</script>