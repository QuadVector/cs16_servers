import { BrowserWindow, nativeTheme } from "electron";
import { DarkMode, LightMode } from "./themes";
import { windowMaterialType } from "../../electron/main";

export function setCurrentThemeMode(mode: string = "system") {
	const windows = BrowserWindow.getAllWindows();

	function setDarkMode(win: BrowserWindow, changeThemeSource: boolean = true) {
		if (windowMaterialType == "fluent") {
			win.setTitleBarOverlay({
				color: "#ffffff00",
				symbolColor: DarkMode.colors["text"],
				height: 32,
			});

			win.setBackgroundColor(DarkMode.colors["background"]);
		}

		if (changeThemeSource) {
			nativeTheme.themeSource = "dark";
		}
	}

	function setLightMode(win: BrowserWindow, changeThemeSource: boolean = false) {
		if (windowMaterialType == "fluent") {
			win.setTitleBarOverlay({
				color: "#ffffff00",
				symbolColor: LightMode.colors["text"],
				height: 32,
			});

			win.setBackgroundColor(LightMode.colors["background"]);
		}

		if (changeThemeSource) {
			nativeTheme.themeSource = "light";
		}
	}

	windows.forEach((win) => {
		switch (mode) {
			case "dark":
				setDarkMode(win, true);
				break;
			case "light":
				setLightMode(win, true);
				break;

			case "system":
				nativeTheme.themeSource = "system";
				if (nativeTheme.shouldUseDarkColors) {
					setDarkMode(win, false);
				} else {
					setLightMode(win, false);
				}
				break;
		}
	});
}
