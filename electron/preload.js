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
    },
    remove:(name)=>{
        return ipcRenderer.sendSync('distroboxRemove',name)
    },
    stop:(name)=>{
        return ipcRenderer.sendSync('distroboxStop',name)
    },
    create:(name,os)=>{
        return ipcRenderer.sendSync('distroboxCreate',os,name)
    }
})
contextBridge.exposeInMainWorld('dialogBox',(title,buttons,message,detail)=>{
    return ipcRenderer.sendSync('dialog',title,buttons,message,detail)
})