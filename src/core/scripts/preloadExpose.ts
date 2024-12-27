import { contextBridge, ipcRenderer } from "electron";

export function initPreloadElectronAPIMethods() {
	console.log("[preloadExpose] Init preload electron API methods");

	contextBridge.exposeInMainWorld("electronAPI", {
		closeApplication: () => {
			ipcRenderer.send("close-application");
		},

		getVersions: () => {
			return ipcRenderer.invoke("get-versions");
		},

		setCurrentThemeMode: (mode: string = "system") => {
			ipcRenderer.send("update-native-colors", mode);
		},

		showSaveFileDialog(options: object) {
			return ipcRenderer.invoke("show-save-file-dialog", options);
		},

		saveFileData(filePath: string, data: string) {
			return ipcRenderer.invoke("save-file-data", filePath, data);
		},

		showOpenFileDialog(options: object) {
			return ipcRenderer.invoke("show-open-file-dialog", options);
		},

		openFileData(filePath: string) {
			return ipcRenderer.invoke("open-file-data", filePath);
		},

		toggleFullScreen() {
			ipcRenderer.send("toggle-fullscreen");
		},

		setZoomFactor(zoomFactor: number) {
			ipcRenderer.send("set-zoom-factor", zoomFactor);
		},

		getZoomFactor(): Promise<number> {
			return ipcRenderer.invoke("get-zoom-factor");
		},

		getCurrentWallpaper(): Promise<string> {
			return ipcRenderer.invoke("get-current-wallpaper");
		}
	});
}