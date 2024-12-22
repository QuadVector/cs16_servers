/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    VITE_PUBLIC: string
  }
}

interface IMenuItem {
  anchor: string;
  name?: string;
  extra?: any;
  icon?: string;
  checked?: boolean;
  disable?: boolean;
  shortcut?: Array<string>;
  notExecutableShortcut?: boolean;
  menu?: IMenuItem[];
}

interface Window {
  setCurrentThemeAppMode: (mode: string) => void;

  electronAPI: {
    closeApplication: () => void;
    getVersions: () => Promise<string[]>;
    setCurrentThemeMode: (mode: string) => void;
    showSaveFileDialog: (options: object) => Promise<SaveDialogReturnValue>;
    saveFileData: (filePath: string, data: string) => Promise<boolean>;
    showOpenFileDialog: (options: object) => Promise<OpenDialogReturnValue>;
    openFileData: (filePath: string) => Promise<any>;
    toggleFullScreen: () => void;
    setZoomFactor: (zoomFactor: number) => void;
    getZoomFactor: () => Promise<number>;
    getCurrentWallpaper: () => Promise<string>;
  };

  //your custom application methods
  application: {
    exampleMethod: () => Promise<string>;
    exampleAlert: () => void;
  }
}
