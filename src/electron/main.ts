import { app, BrowserWindow } from "electron";
import { release } from "node:os";
import { join, dirname } from "path";
import { fileURLToPath } from "node:url";
import { initElectronWindowEvents } from "../core/scripts/electronWindowEvents";
import { initBrowserWindowEvents } from "../core/scripts/browserWindowEvents";
import { initElectronAPIEvents } from "../core/scripts/electronAPIEvents";
import { initDarkModeEvents } from "../core/scripts/darkModeEvents";
import { initAppEvents } from "./appEvents";
const remoteMain = require("@electron/remote/main");

globalThis.__filename = fileURLToPath(import.meta.url);
globalThis.__dirname = dirname(__filename);

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, "../src/public")
	: process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let win: BrowserWindow;
const url: string = String(process.env.VITE_DEV_SERVER_URL);
const indexHtml = join(process.env.DIST, "index.html");

export const windowMaterialType: string = "fluent"; // fluent or default

async function createWindow() {
	const winProps = {
		title: "Electron Fluent template",
		icon: join(process.env.VITE_PUBLIC, "/favicon.ico"),
		width: 1280,
		height: 800,
		minWidth: 600,
		minHeight: 750,
		fullscreenable: true,
		offscreen: false,
		webPreferences: {
			nodeIntegration: false, // Отключаем для безопасности
			contextIsolation: true,  // Включаем contextIsolation
			devTools: true,
			webSecurity: true,
			preload: join(__dirname, "preload.js"), // Указываем путь к preload
		},
		maximizable: true,
		resizable: true,
		autoHideMenuBar: true,
		show: false,
		titleBarOverlay: {
			height: 32,
		},
		backgroundColor: "default",
		frame: true,
		titleBarStyle: "default",
	};

	if (windowMaterialType == "fluent") {
		winProps.titleBarStyle = "hidden";
		winProps.frame = false;
	} else {
		winProps.titleBarStyle = "default";
		winProps.frame = true;
	}

	//@ts-ignore
	win = new BrowserWindow(winProps);
	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(url);
	} else {
		win.loadFile(indexHtml);
	}

	remoteMain.initialize();
	initBrowserWindowEvents(win, windowMaterialType);
	initElectronWindowEvents(app, win);
	initAppEvents(app, win);
	initElectronAPIEvents(app, win);
	initDarkModeEvents(app, win);

	app.on("activate", () => {
		const allWindows = BrowserWindow.getAllWindows();
		if (allWindows.length) {
			allWindows[0].focus();
		} else {
			createWindow();
		}
	});

	remoteMain.enable(win.webContents);
}

//disable second instance
app.on("second-instance", () => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.whenReady().then(() => {
	createWindow();
});