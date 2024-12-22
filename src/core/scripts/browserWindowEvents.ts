import { BrowserWindow, shell } from "electron";

export function initBrowserWindowEvents(win: BrowserWindow, windowMaterialType: string) {
	console.log("[browserWindowEvents] Init browser window events");

	//focus event
	win.on("focus", function () {
		win.webContents.executeJavaScript(
			`document.querySelector("body").classList.remove("unfocused");`
		);
	});

	//blur event
	win.on("blur", function () {
		win.webContents.executeJavaScript(
			`document.querySelector("body").classList.add("unfocused");`
		);

		//close main menu on blur and other blur actions
		win.webContents.executeJavaScript(
			`document.querySelector("body").click();`
		);
	});

	//fullscreen mode body class
	win.on("enter-full-screen", () => {
		win.webContents.executeJavaScript(
			`document.querySelector("body").classList.add("fullscreen");`
		);
	});

	win.on("leave-full-screen", () => {
		win.webContents.executeJavaScript(
			`document.querySelector("body").classList.remove("fullscreen");`
		);
	});

	// Test actively push message to the Electron-Renderer
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString())
	})

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url)
		return { action: "deny" }
	})

	win.once("ready-to-show", () => {
		//execute an extra script for getting theme mode for reducing flickering
		win.webContents
			.executeJavaScript(`
				localStorage.getItem("current_theme_mode");
				document.querySelector("body").classList.remove("loading");
			`, true)
			.then(() => {
				win?.show();
			});
	});


	// Update window material type
	win.webContents.executeJavaScript(
		`document.querySelector("body").classList.add("window-material-type-${windowMaterialType}");`
	);
}