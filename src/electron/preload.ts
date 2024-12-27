import { initPreloadElectronAPIMethods } from "../core/scripts/preloadExpose";
import { contextBridge, ipcRenderer } from "electron";

initPreloadElectronAPIMethods();

//your methods here
contextBridge.exposeInMainWorld("application", {
	//extract IP addresses from web page
	parseIPList: (url: string): Promise<Array<string>> => {
		return new Promise((resolve) => {
			ipcRenderer.invoke("parse-ip-list", url).then((data) => {
				resolve(data);
			});
		});
	},
	parsePaginationLinks: (url: string): Promise<Array<string>> => {
		return new Promise((resolve) => {
			ipcRenderer.invoke("parse-pagination-links", url).then((data) => {
				resolve(data);
			});
		});
	},

	getCS16ServerInfo(ip: string): any {
		return new Promise((resolve) => {
			ipcRenderer.invoke("get-cs16-server-info", ip).then((data) => {
				resolve(data);
			});
		});
	},

	getIPGeolocation(ip: string): any {
		return new Promise((resolve) => {
			ipcRenderer.invoke("get-ip-geolocation", ip).then((data) => {
				resolve(data);
			});
		});
	},
});
