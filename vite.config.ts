import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	fs.rmSync('electron', { recursive: true, force: true })

	const isServe = command === 'serve'
	const isBuild = command === 'build'
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG

	return {
		plugins: [
			vue(),
			electron({
				main: {
					entry: 'src/electron/main.ts',
					onstart({ startup }) {
						if (process.env.VSCODE_DEBUG) {
							console.log('[startup] Electron App')
						} else {
							startup()
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: 'dist/electron',
							rollupOptions: {
								external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
							},
						},
					},
				},
				preload: {
					input: 'src/electron/preload.ts',
					vite: {
						build: {
							sourcemap: sourcemap,
							minify: isBuild,
							outDir: 'dist/electron',
							rollupOptions: {
								external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
							},
						},
					},
				},
				renderer: {},
			}),
		],
		server: process.env.VSCODE_DEBUG && (() => {
			const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
			return {
				host: url.hostname,
				port: +url.port,
			}
		})(),
		clearScreen: false,
	}
})