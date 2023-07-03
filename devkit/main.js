const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var dom = new JSDOM('<!DOCTYPE html><html><head id="head"></head><body id="__main"></body></html>')
const document = dom.window.document
var appFile= JSON.parse(fs.readFileSync(path.join(__dirname,'app.json')).toString())
var componentList =  fs.readdirSync(path.join(__dirname,'/components'))
var root = appFile.root

var app ={}
function convertObjectToDom(obj){
    if(componentList.includes(`${obj.type}.html`)){
        var compHtml = fs.readFileSync(path.join(__dirname,'/components/',`${obj.type}.html`)).toString()
        for(var i=0;Object.keys(obj).length>i;i++){
            if(!(Object.keys(obj)[i]=='type')){
                compHtml =compHtml.replaceAll('${'+Object.keys(obj)[i]+'}',obj[Object.keys(obj)[i]])
            }else{continue} 
        }
        return compHtml
    }else{return}
}
function getParent(o){
    if(o.nodes != undefined){
         for(n in o.nodes){
             o.nodes[n].parent = o;
             getParent(o.nodes[n]);
         }
    }
}
document.getElementById('__main').innerHTML =convertObjectToDom(root)
var docRoot = document.getElementById(root.id)
for(var counter=0;root.children.length>counter;counter++){
    let comp = document.createRange().createContextualFragment(convertObjectToDom(root.children[counter]))
    console.log(root.children.parentNode);
    //console.log(parentNode)
}
console.log(document.getElementsByTagName('html')[0].outerHTML)
