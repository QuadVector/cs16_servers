import { BrowserWindow, nativeTheme } from "electron";
import { DarkMode, LightMode } from "./themes";
import { windowMaterialType } from "../../electron/main";

export function setCurrentThemeMode(mode: string = "system") {
	const windows = BrowserWindow.getAllWindows();

	function setDarkMode(win: BrowserWindow) {
		if (windowMaterialType == "fluent") {
			win.setTitleBarOverlay({
				color: "#ffffff00",
				symbolColor: DarkMode.colors["text"],
				height: 32,
			});

			win.setBackgroundColor(DarkMode.colors["background"]);
		}

		nativeTheme.themeSource = "dark";
	}

	function setLightMode(win: BrowserWindow) {
		if (windowMaterialType == "fluent") {
			win.setTitleBarOverlay({
				color: "#ffffff00",
				symbolColor: LightMode.colors["text"],
				height: 32,
			});

			win.setBackgroundColor(LightMode.colors["background"]);
		}

		nativeTheme.themeSource = "light";
	}

	windows.forEach((win) => {
		switch (mode) {
			case "dark":
				setDarkMode(win);
				break;
			case "light":
				setLightMode(win);
				break;

			case "system":
				if (nativeTheme.shouldUseDarkColors) {
					setDarkMode(win);
				} else {
					setLightMode(win);
				}
				break;
		}
	});
}
