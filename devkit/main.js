const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom');
const xml = require('xml2js')
const { JSDOM } = jsdom;
var dom = new JSDOM('<!DOCTYPE html><html><head id="head"></head><body id="__main"></body></html>')
const document = dom.window.document
var appFile= JSON.parse(fs.readFileSync(path.join(__dirname,'app.json')).toString())
var componentList =  fs.readdirSync(path.join(__dirname,'/components'))
var root = appFile.root
var app ={}
var xmlstr = fs.readFileSync(path.join(__dirname,'app.xml'))
xml.parseString(xmlstr, function (err, result) {
    // $: properties of element, _: value of element
    result=JSON.stringify(result)
    console.log(result)
});
function convertXmltoObj(name,obj){

}
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
function genChildren(parent){
    var children =[]
    //console.log(parent)
    parent.children.forEach(obj =>{
        if(!(obj.children=={})){
            children.push(convertObjectToDom(obj).replace('${__children}',genChildren(obj)))
        }else{
            children.push(convertObjectToDom(obj).replace('${__children}',''))
        }
    })
    return children.join('')
}
document.getElementById('__main').innerHTML =convertObjectToDom(root).replace('${__children}',genChildren(root))
var docRoot = document.getElementById(root.id)
//console.log(genChildren(root))
console.log(document.getElementsByTagName('html')[0].outerHTML)
