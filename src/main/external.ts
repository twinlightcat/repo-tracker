import { ipcMain, shell } from "electron";

export function registerExternalLinks() {
  const openExternal = (url: string) => {
    if (!url.startsWith("http")) {
      throw new Error("Invalid URL");
    }
    shell.openExternal(url).catch((error) => {
      console.error("Failed to open external URL:", error);
    });
  };

  ipcMain.on("open-external", (_, url: string) => {
    openExternal(url);
  });
}
