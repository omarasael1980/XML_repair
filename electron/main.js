const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true, // Esto hace que la ventana ocupe toda la pantalla
    webPreferences: {
      nodeIntegration: false, // Mejor para seguridad
      contextIsolation: true, // Mejor para seguridad
    },
  });

  // Cargar el frontend de React en desarrollo (localhost:5173)
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
