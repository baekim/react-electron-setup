const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
let mainWindow;

function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {

            //preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }

        //icon: path.join(__dirname, 'build', 'milliman_logo_white.png')
    })

    // and load the index.html of the app.
    // mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadFile('./public/electron.html')
    // mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/electron.html')}`);

    // loader
    const loading = new BrowserWindow({
        show: false,
        frame: false,
        width: 600,
        height: 275
    });

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../', 'build', 'index.html'),
        protocol: 'file:',
        slashes: true
    })

    // console.log('startUrl', startUrl);
    //mainWindow.loadURL(startUrl);

    loading.once('show', () => {

        mainWindow.on('ready-to-show', function () {

            mainWindow.show();
            loading.close();

        })

        console.log('startUrl', startUrl);
        mainWindow.loadURL(startUrl);

        //initDatabase();

    })

    const loadingUrl = path.join(startUrl, process.env.ELECTRON_START_URL ? 'loading.html' : '../loading.html')

    loading.loadURL(loadingUrl)
    loading.show();

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {

        mainWindow = null;

    })

}

app.allowRendererProcessReuse = false;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    createWindow()

    app.on('activate', function () {


        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {

            createWindow()

        }

    })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {

        app.quit()

    }

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.