// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

const api = {
  openExternal: (url: string) => {
    if (!url.startsWith("http")) {
      throw new Error("Invalid URL");
    }
    ipcRenderer.send("open-external", url);
  },
};

contextBridge.exposeInMainWorld("api", api);
