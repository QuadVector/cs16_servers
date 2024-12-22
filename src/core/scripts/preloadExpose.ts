import { contextBridge, ipcRenderer } from "electron";

export function initPreloadElectronAPIMethods() {
	console.log("[preloadExpose] Init preload electron API methods");
	
	contextBridge.exposeInMainWorld("electronAPI", {
		closeApplication: () => {
			ipcRenderer.send("close-application");
		},

		getVersions: () => {
			return new Promise((resolve) => {
				ipcRenderer.invoke("get-versions").then((versions) => {
					resolve(versions);
				});
			});
		},

		setCurrentThemeMode: (mode: string = "system") => {
			ipcRenderer.send("update-native-colors", mode);
		},

		showSaveFileDialog(options: object) {
			return new Promise((resolve) => {
				ipcRenderer.invoke("show-save-file-dialog", options).then((filePath) => {
					resolve(filePath);
				});
			});
		},

		saveFileData(filePath: string, data: string) {
			return new Promise((resolve, reject) => {
				ipcRenderer.invoke("save-file-data", filePath, data).then((result) => {
					resolve(result);
				}).catch((error) => {
					reject(error);
				});
			});
		},

		showOpenFileDialog(options: object) {
			return new Promise((resolve) => {
				ipcRenderer.invoke("show-open-file-dialog", options).then((filePath) => {
					resolve(filePath);
				});
			});
		},

		openFileData(filePath: string) {
			return new Promise((resolve, reject) => {
				ipcRenderer.invoke("open-file-data", filePath).then((result) => {
					resolve(result);
				}).catch((error) => {
					reject(error);
				});
			});
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
	});
}