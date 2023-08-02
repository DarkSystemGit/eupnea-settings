document.getElementById('pageImport').innerHTML = window.fs.read('containers.html')
var images = JSON.parse(distrobox.images())
var containerList = JSON.parse(distrobox.list())
var containers = []
containerList.forEach(elem => {

    let listItem = { name: elem.name.charAt(0).toUpperCase() + elem.name.slice(1), image: Object.keys(images)[Object.values(images).indexOf(elem.image)] }
    if (listItem.image == undefined) {
        listItem.image = 'Undefined'
    }
    listItem.image = `./icons/${listItem.image}.svg`
    containers.push(listItem)
});
console.log(containers)
containers.forEach((container) => {
    var containerString = `<tr>
    <td style="width:42.5%;"><img src="${container.image}" style="height:4%;width:10%;"></td>
    <td><p style="font-size: larger;padding-top:2.5%">${container.name}</p></td>
    <td><span id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}More" uk-icon="more-vertical" style="margin-left:90%;height:100%;width:100%;margin-top:6%;"></span></td>
    <div uk-dropdown="mode: click; pos:bottom-right" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}MoreDropdown">
    <div id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}Stop">
        <div style="color:red;display:flex;"><span class="material-symbols-outlined" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StopIcon">
        cancel
        </span></span><p class="dropDownTxt" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StopTxt">Stop</p></div>
    </div>
    <div class="divider"></div>
    <div id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}Remove">
        <div style="color:red;display:flex;"><span class="material-symbols-outlined" style="margin-top:0.5vh;" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}RemoveIcon">
        remove
        </span><p class="dropDownTxt" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}RemoveTxt">Remove</p></div>
    </div>
    
    
    </div>
    </tr>`
    container.name = container.name.charAt(0).toLowerCase() + container.name.slice(1)
    document.getElementById('containerList').innerHTML = `${document.getElementById('containerList').innerHTML}${containerString}`
    function dialog(name,message,detail){
        var buttons =['Okay','Cancel']
        return dialogBox(name,buttons,message,detail)
    }
    document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}More`).addEventListener('click', () => { UIkit.dropdown(document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}MoreDropdown`)) })
    console.log(`${container.name.charAt(0).toLowerCase()+container.name.slice(1)}Remove`)
    function assignDistroboxEvent(type,child){
        document.getElementById(`${container.name.charAt(0).toLowerCase()+container.name.slice(1)}${type}${child}`).addEventListener('click',()=>{
            if(dialog('Settings',`Are you sure you want to ${type} this container?`)==0){
                distrobox[type](container.name)
            }
        })
    } 
    assignDistroboxEvent('Remove','Txt')
    assignDistroboxEvent('Remove','Icon')
    assignDistroboxEvent('Stop','Txt')
    assignDistroboxEvent('Stop','Icon')

})
