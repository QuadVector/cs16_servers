import { initPreloadElectronAPIMethods } from "../core/scripts/preloadExpose";
import { contextBridge, ipcRenderer } from "electron";

initPreloadElectronAPIMethods();

//your methods here
contextBridge.exposeInMainWorld("application", {
	//extract IP addresses from web page
	parseIPList: (url: string): Promise<Array<string>> => {
		return ipcRenderer.invoke("parse-ip-list", url);
	},
	parsePaginationLinks: (url: string): Promise<Array<string>> => {
		return ipcRenderer.invoke("parse-pagination-links", url);
	},

	getCS16ServerInfo(ip: string): any {
		return ipcRenderer.invoke("get-cs16-server-info", ip);
	},

	getIPGeolocation(ip: string): Promise<any> {
		return ipcRenderer.invoke("get-ip-geolocation", ip);
	},

	getCS16MasterServerIPs(address: string): Promise<Array<string>> {
		return ipcRenderer.invoke("get-cs16-master-server-ips", address);
	},
});
