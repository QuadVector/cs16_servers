// Импортируем Pinia store, если нужно
import { useMainStore } from "./store/mainStore";
import { useMenuStore } from "./store/menuStore";

// Определяем функцию для обработки событий меню
export const menuSelectEvent = (e: any, router: any) => {
    switch (e.anchor) {
        case "app-close":
            window.electronAPI.closeApplication();
            break;
        case "color-theme-light":
            window.setCurrentThemeAppMode("light");
            useMenuStore().ChangeElementState("color-theme-light", { checked: true });
            useMenuStore().ChangeElementState("color-theme-dark", { checked: false });
            useMenuStore().ChangeElementState("color-theme-system", { checked: false });
            break;
        case "color-theme-dark":
            window.setCurrentThemeAppMode("dark");
            useMenuStore().ChangeElementState("color-theme-light", { checked: false });
            useMenuStore().ChangeElementState("color-theme-dark", { checked: true });
            useMenuStore().ChangeElementState("color-theme-system", { checked: false });
            break;
        case "color-theme-system":
            window.setCurrentThemeAppMode("system");
            useMenuStore().ChangeElementState("color-theme-light", { checked: false });
            useMenuStore().ChangeElementState("color-theme-dark", { checked: false });
            useMenuStore().ChangeElementState("color-theme-system", { checked: true });
            break;
        case "help-about":
            useMainStore().activeAboutModal = true;
            break;
    }
};
