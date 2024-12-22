import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
const remoteMain = require("@electron/remote/main");

export function initElectronWindowEvents(app: Electron.App, win: BrowserWindow) {
	console.log("[electronWindowEvents] Init electron window events");

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit()
	})

	// New window example arg: new windows url
	ipcMain.handle("open-win", (event, arg) => {
		const childWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true
			},
		});

		remoteMain.enable(childWindow.webContents);

		const url = process.env.VITE_DEV_SERVER_URL;
		const indexHtml = join(process.env.DIST, "index.html");

		if (process.env.VITE_DEV_SERVER_URL) {
			childWindow.loadURL(`${url}#${arg}`)
		} else {
			childWindow.loadFile(indexHtml, { hash: arg })
		}
	});
}