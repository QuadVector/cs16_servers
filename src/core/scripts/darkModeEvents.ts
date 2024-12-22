import { ipcMain, systemPreferences, BrowserWindow } from "electron";
import { setCurrentThemeMode } from "./helpers";

export function initDarkModeEvents(app: Electron.App, win: BrowserWindow) {
	console.log("[darkModeEvents] Init dark mode events");

	systemPreferences.on("accent-color-changed", (event, mode) => {
		setCurrentThemeMode(mode);
	});

	ipcMain.on("color-scheme-toggle", (event, mode) => {
		setCurrentThemeMode(mode);
	});

	ipcMain.on('update-native-colors', (event, mode) => {
		setCurrentThemeMode(mode);
	});
}