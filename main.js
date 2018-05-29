const {app,BrowserWindow}=require('electron')
const url=require('url')
const path=require('path')
const ipc=require('electron').ipcMain
const dialog=require('electron').dialog
const fs=require('fs')


let win;

function createWindow(){
  win=new BrowserWindow({
    width:900,
    height:700
  })

  win.loadURL(url.format({
    pathname:path.join(__dirname,'index.html'),
    protocol:'file:',
    slashes:true
  }))

  win.openDevTools()
  
  
}

ipc.on('open-dialog',function(event){
    dialog.showOpenDialog({ filters: [
        { name: 'text', extensions: ['txt'] }
       ],
       properties: ['multiSelections']
    },function(files){
        if(files=== undefined) return
        var fileName = files[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {

            event.sender.send('selected-file',data)
        
          });
        
    })
})



ipc.on('save-dialog',function(event,data){
    dialog.showSaveDialog({ filters: [
        { name: 'text', extensions: ['txt'] }
       ],
       properties: ['multiSelections']
    },function(files){
        if(files=== undefined) return
        fs.writeFile(files, data, function (err) {

            if (err === undefined) {

                dialog.showMessageBox({title:"Message title", message: "The file has been saved! ",

            buttons: ["OK"] ,icon:'ok.png'});
         
              } else {
         
                dialog.showErrorBox("File Save Error", "Error Message");
         
              }
            
            
      
        });
        
    })
})


app.on('ready',createWindow)


