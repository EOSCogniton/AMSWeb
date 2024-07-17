const TOTAL_IC = 1 // Nombre de BMS
const MAX_MUX = 12 // Nombre de sondes de températures connectées par BMS
const path = ""//"../AMS/" // Chemin vers le répertoire de données

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}
var actualdata = loadFile(path + "data.bin")
actualdata.arrayBuffer().then(function (result) {
    view = new Uint8Array(result)
    console.log(view)
})
console.log(actualdata)