// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const distrobox = require('distrobox-node')
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
      
    }
  })
  const dialogBox = async(title,buttons,message,detail)=>{
    return new Promise((resolve)=>{
        const options = {
            type: 'question',
            buttons,
            defaultId: 2,
            title,
            message,
            detail
            
          };
        
          resolve(dialog.showMessageBoxSync(null, options));
    })
    
  }
  ipcMain.on('fsRead', (event, file) => {
    const webContents = event.sender
    event.returnValue = fs.readFileSync(path.join(__dirname,file)).toString()
  })
  ipcMain.on('distroboxList', async (event) => {
    const webContents = event.sender
    event.returnValue = JSON.stringify(await distrobox.list())
  })
  ipcMain.on('distroboxCreate', async (event,os,name) => {
    const webContents = event.sender
    event.returnValue = await distrobox.create(os,name)
  })
  ipcMain.on('distroboxRemove', async (event,name) => {
    const webContents = event.sender
    event.returnValue = await distrobox.remove(name)
  })
  ipcMain.on('distroboxStop', async (event,name) => {
    const webContents = event.sender
    event.returnValue = await distrobox.stop(name)
  })
  ipcMain.on('distroboxImages', async (event) => {
    const webContents = event.sender
    event.returnValue = JSON.stringify(await distrobox.getImages())
  })
  ipcMain.on('distroboxEnter', async (event,name) => {
    const webContents = event.sender
    async function runComm(comm) {
      return new Promise((resolve, reject) => {
          child_process.exec(comm, (error, stdout, stderr) => {
              if (error) {
                  reject(`error: ${error.message}`);
                  return;
              }
              if (stderr) {
                  resolve(`${stderr}`);
                  return;
              }
              resolve(stdout)
          });
      })
  }
    event.returnValue = await runComm(`x-terminal-emulator -e distrobox-enter --root --name ${name}`)
  })
  ipcMain.on('dialog', async (event,title,buttons,message,detail) => {
    const webContents = event.sender
    event.returnValue = await dialogBox(title,buttons,message,detail)
  })
  // and load the index.html of the app.
  mainWindow.loadFile('./electron/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.