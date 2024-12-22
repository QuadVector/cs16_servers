import { BrowserWindow, ipcMain } from "electron";

export function initAppEvents(app: Electron.App, win: BrowserWindow) {
	//place all custom electron app events here
	ipcMain.handle("example-method", () => {
		return new Promise((resolve) => {
			resolve("Hello, world!");
		});
	});
}