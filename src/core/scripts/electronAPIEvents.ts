import { ipcMain, dialog, BrowserWindow, SaveDialogReturnValue, OpenDialogReturnValue } from "electron";
import { exec } from 'child_process';
import os from 'os';
import iconv from 'iconv-lite';
const fs = require("fs");

export function initElectronAPIEvents(app: Electron.App, win: BrowserWindow) {
	console.log("[electronAPIEvents] Init electron API events");

	ipcMain.handle("get-versions", (event: any) => {
		return {
			electronVersion: process.versions.electron,
			chromiumVersion: process.versions.chrome,
			nodejsVersion: process.versions.node,
			v8Version: process.versions.v8,
			osInfo: `${process.platform} ${process.arch} ${process.getSystemVersion()}`
		};
	});

	ipcMain.on("close-application", (event: any) => {
		app.quit();
	});

	ipcMain.on("toggle-fullscreen", (event: any) => {
		const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
		if (win.isFullScreenable()) {
			win.setFullScreen(!win.isFullScreen());
		}
	});

	ipcMain.on("set-zoom-factor", (event: any, zoomFactor: number) => {
		const minZoomFactor = 0.5;
		const maxZoomFactor = 1.5;

		const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

		const currentZoomFactor = win.webContents.getZoomFactor();
		if (zoomFactor < minZoomFactor) zoomFactor = minZoomFactor;
		if (zoomFactor > maxZoomFactor) zoomFactor = maxZoomFactor;
		if (currentZoomFactor === zoomFactor) return;

		win.webContents.setZoomFactor(zoomFactor);
	});

	ipcMain.handle("get-zoom-factor", (event: any) => {
		const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
		return win.webContents.getZoomFactor();
	});

	ipcMain.handle("show-save-file-dialog", (event: any, options: object): Promise<SaveDialogReturnValue> => {
		const totalOptions = { ...options };
		const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
		return dialog.showSaveDialog(win, totalOptions);
	});

	ipcMain.handle("save-file-data", async (event, filePath: string, data: string): Promise<void> => {
		try {
			await fs.promises.writeFile(filePath, data);
		} catch (error) {
			throw error;
		}
	});

	ipcMain.handle("show-open-file-dialog", (event: any, options: object): Promise<OpenDialogReturnValue> => {
		const totalOptions = { ...options };
		const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
		return dialog.showOpenDialog(win, totalOptions);
	});

	ipcMain.handle("open-file-data", (event, filePath: string): Promise<any> => {
		try {
			return fs.promises.readFile(filePath, "utf-8");
		} catch (error) {
			throw error;
		}
	});

	ipcMain.handle("get-current-wallpaper", (): Promise<string> => {
		return new Promise((resolve, reject) => {
			if (os.platform() === 'win32') {
				const command = 'powershell -Command "Get-ItemPropertyValue -Path \'HKCU:\\Control Panel\\Desktop\' -Name Wallpaper"';
				exec(command, { encoding: 'buffer' }, (err, stdout, stderr) => {
					if (err) {
						resolve("");
					}

					const decodedStdout = iconv.decode(stdout, 'cp866').replace(/\\/g, '/');
					resolve(decodedStdout.trim());
				});
			} else {
				resolve("");
			}
		});
	});
}