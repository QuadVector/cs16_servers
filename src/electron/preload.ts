import { initPreloadElectronAPIMethods } from "../core/scripts/preloadExpose";
import { contextBridge, ipcRenderer } from "electron";

initPreloadElectronAPIMethods();

//your methods here
contextBridge.exposeInMainWorld("application", {
	/*
		window.application.exampleMethod().then((data) => {
			console.log(data);
		});
	*/
	exampleMethod: (): Promise<string> => {
		return new Promise((resolve) => {
			ipcRenderer.invoke("example-method").then((data) => {
				resolve(data);
			});
		});
	},

	/*
		window.application.exampleAlert();
	*/
	exampleAlert: (): void => {
		alert("test");
	},
});
