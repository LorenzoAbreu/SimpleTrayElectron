const { app, Menu, Tray, dialog } = require('electron');
const path = require('path/posix');
const os = require('os')
const package = require('./package.json')
const fs = require('fs')
let roaming = os.homedir() + "\\AppData\\Roaming\\" + package.name
try{require('child_process').exec('mkdir ' + roaming)}catch{}
let db = roaming + "\\config.json"
const editJsonFile = require("edit-json-file");
const fsExtra = require('fs-extra')
let file = editJsonFile(db, {
    autosave: true
});

// require('./updater').checkForUpdates();

file.set('Nome', package.name)
file.set('Versão', package.version)
file.set('Descrição', package.description)
file.save()


let tray;
let contextMenu;
let content = `{
    "Nome": "${package.name}",
    "Versão": "${package.version}",
    "Descrição": "${package.description}"
}`

function dbFunctions(type){
    if (type == 'normal'){
        if (fs.existsSync(db)){

        }
        else{
            fs.writeFileSync(db, content)
        }
    }
    else if (type == 'force'){
        fs.writeFileSync(db, content)
    }
    else{
        return
    }
}

dbFunctions('normal')

let Temp = "C:\\Windows\\Temp"
let temp = os.homedir() + "\\AppData\\Local\\Temp"


const { Nome, Versão, Descrição } = require(db)

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'gear.png'))

    contextMenu = Menu.buildFromTemplate([
        {label: 'Assistente pessoal', icon: path.join(__dirname, 'gear@15x15.png'), type: 'normal', enabled: false},
        {type: 'separator'},
        {label: 'Checar atualizações', type: 'normal'},
        {label: 'Abrir pasta padrão', type: 'normal', click: () => {
            require('child_process').exec(`start ${roaming}`)
        }},
        {label: 'Redefinir configurações', type: 'normal', click: () => {
            dbFunctions('force')
        }},
        {type: 'separator'},
        {label: 'Configurações', submenu: [
            {label: 'Otimizações', submenu: [
                {label: 'Limpar Temp', type: 'normal', click: () => {
                    try{
                        fsExtra.emptyDirSync(Temp)
                    }
                    catch{
                        const options = {
                            type: 'error',
                            buttons: ['OK'],
                            defaultId: 1,
                            title: 'Erro => Temp',
                            icon: path.join(__dirname, 'gear.png'),
                            message: 'Não foi possível limpar a pasta ' + Temp,
                            detail: 'Infelizmente nos deparamos com um erro ao limpar a pasta ' + Temp + ' tente executar o Assistente Pessoal como admistrador para tentar solucionar este problema.',
                          };
                        
                        dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                            console.log(response);
                            console.log(checkboxChecked);
                        });  
                    } 
                }},
                {label: 'Limpar %temp%', type: 'normal', click: () => {
                    try{
                        fsExtra.emptyDirSync(temp)
                    }
                    catch{
                        const options = {
                            type: 'error',
                            buttons: ['OK'],
                            defaultId: 1,
                            title: 'Erro => temp',
                            icon: path.join(__dirname, 'gear.png'),
                            message: 'Não foi possível limpar a pasta ' + temp,
                            detail: 'Infelizmente nos deparamos com um erro ao limpar a pasta ' + temp + ', tente executar o Assistente Pessoal como admistrador para tentar solucionar este problema.',
                          };
                        
                        dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                            console.log(response);
                            console.log(checkboxChecked);
                        });  
                    }
                }}
            ]}
        ]},
        {type: 'separator'},
        {label: 'Sair de Assistente pessoal', type: 'normal', click: () => {
            app.quit();
        }}
    ])

    tray.setToolTip(package.name)
    tray.setContextMenu(contextMenu)

})