document.getElementById('pageImport').innerHTML = window.fs.read('containers.html')
function assignEventListeners(containers) {
    containers.forEach((container) => {
        function dialog(name, message, detail) {
            var buttons = ['Okay', 'Cancel']
            return dialogBox(name, buttons, message, detail)
        }
        function assignDistroboxEvent(type, child) {
            console.log(document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}${type}${child}`))

            document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}${type}${child}`).onclick = () => {

                if (dialog('Settings', `Are you sure you want to ${type.charAt(0).toLowerCase() + type.slice(1)} this container?`) == 0) {

                    distrobox[type.charAt(0).toLowerCase() + type.slice(1)](container.name)
                    assignEventListeners(genContainerList())
                }
            }


        }
        assignDistroboxEvent('Remove', 'Txt')
        assignDistroboxEvent('Remove', 'Icon')
        assignDistroboxEvent('Stop', 'Txt')
        assignDistroboxEvent('Stop', 'Icon')
        let startHandler = () => {
            console.log('start')
            distrobox.enter(container.name)
        }
        document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StartTxt`).onclick = startHandler
        document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StartIcon`).onclick = startHandler
    })
}
function genContainerList() {
    document.getElementById('containerList').innerHTML = ""
    var images = JSON.parse(distrobox.images())
    console.log(images)
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
    <div id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}Start">
    <div style="display: flex;color: green;">
    <span class="material-symbols-outlined" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StartIcon">terminal
    </span>
    <p class="dropDownTxt" id="${container.name.charAt(0).toLowerCase() + container.name.slice(1)}StartTxt">Start</p>
</div>
</div>
    <div class="divider" style="
    margin-bottom: 4%;
    margin-top: 3%;
    "></div>
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

        document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}More`).addEventListener('click', () => { UIkit.dropdown(document.getElementById(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}MoreDropdown`)) })
        console.log(`${container.name.charAt(0).toLowerCase() + container.name.slice(1)}Remove`)


    })
    return containers
}
function floatingBotton(elm, click) {
    //var btn = new MDCRipple(elm);
    elm.addEventListener('click', click)
}
function generateOSList() {
    var images = Object.keys(JSON.parse(distrobox.images()))
    images.forEach((image) => {

        var option = document.createElement('option')
        option.value = image
        option.innerText = `${image.charAt(0).toUpperCase()}${image.slice(1)}`.replace('linux', ' Linux').replace('Linux', ' Linux').replace('os', ' OS')
        if (image == "opensuse") {
            option.innerText = "Open Suse"
        }
        if (image == "centosstream") {
            option.innerText = "Cent OS Stream"
        }
        document.getElementById('osChoser').appendChild(option)
    })

}
window.addEventListener('DOMContentLoaded', () => {
    assignEventListeners(genContainerList())
    generateOSList()
    floatingBotton(document.getElementsByClassName('mdc-fab')[0], () => {
        UIkit.modal(document.getElementById('createContainerModal')).show()
    })
    document.getElementById('createSubmit').addEventListener('click', () => {
        distrobox.create(document.getElementById('containerName').value, document.getElementById('osChoser').value)
        assignEventListeners(genContainerList())
        UIkit.modal(document.getElementById('createContainerModal')).hide()
    })
})


