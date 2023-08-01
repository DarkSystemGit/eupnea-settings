const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('fs',{
    read:(file)=>{
        return ipcRenderer.sendSync('fsRead',file)
    }
})
contextBridge.exposeInMainWorld('distrobox',{
    list:()=>{
        return ipcRenderer.sendSync('distroboxList')
    },
    images:()=>{
        return ipcRenderer.sendSync('distroboxImages')
    }
})
contextBridge.exposeInMainWorld('dialogBox',(title,buttons,message,detail)=>{
    return ipcRenderer.sendSync('dialog',title,buttons,message,detail)
})