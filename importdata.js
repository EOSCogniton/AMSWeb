const TOTAL_IC = 1; // Nombre de BMS
const MAX_MUX = 12; // Nombre de sondes de températures connectées par BMS
const FSR = 6.144; // Voir ADC.py
const RESISTOR = 47; //Idem
const path = "/data/"; // Chemin vers le répertoire de données

const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadData(filePath) {
    const req = new XMLHttpRequest();
    req.open("GET", filePath, true);
    req.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    req.setRequestHeader("Pragma", "no-cache"); // HTTP 1.0.
    req.setRequestHeader("Expires", "0"); // Proxies.
    req.responseType = "arraybuffer";
    req.onload = (event) => {
        // data = new Uint16Array(req.response); // Note: not req.responseText
        // console.log(req.response.slice(0, 8))
        dataview = new DataView(req.response);
        readData(dataview);
        setTimeout(loadData(filePath), "100");
    };
    req.send();
}
function readData(data) {
    chunksize = (4 + 1 + (12 + MAX_MUX) * TOTAL_IC) * 2 + 32;
    var data_fit = {};
    if (data.byteLength / chunksize > 100) {
        var n = data.byteLength / chunksize - 100;
    }
    else { var n = 0; }
    // console.log(n);
    for (i = n; i < data.byteLength / chunksize; i++) {
        var date = data.getBigUint64(i * chunksize);
        var mes = new Object;
        mes["date"] = new Date(Number(date) / 1e5);
        mes["current"] = Math.round(data.getUint16(i * chunksize + 8) * 1000 * FSR / (2 ** 15) / RESISTOR * 100) / 100;
        for (current_bms = 0; current_bms < TOTAL_IC; current_bms++) {
            var ICj = new Object;
            for (cell = 0; cell < 12; cell++) {
                indic = i * chunksize + 8 + 2 + (current_bms * (12 + MAX_MUX) + cell) * 2;
                ICj["cell" + String(cell + 1)] = data.getUint16(indic) / 10000;
            }
            for (temp_n = 0; temp_n < MAX_MUX; temp_n++) {
                indic = i * chunksize + 8 + 2 + (current_bms * (12 + MAX_MUX) + 12 + temp_n) * 2;
                ICj["temp" + String(temp_n + 1)] = Math.round(temp(data.getUint16(indic) * 0.0001) * 100) / 100;
            }
            mes["IC" + String(current_bms + 1)] = ICj;
        }
        data_fit[i - n] = mes;
    }
    document.getElementById("main").innerHTML = format_data(data_fit);
    // const scrollBox = document.getElementById("main");
    // if (document.getElementById("scroll-auto").checked) { scrollBox.scrollTop = scrollBox.scrollHeight; }
}




function format_data(data_fitted) {
    var read = new String;
    for (i = 0; i < Object.keys(data_fitted).length; i++) {
        data_now = data_fitted[i];
        var str = "Date : " + data_now["date"].toLocaleString() + ":" + data_now["date"].getMilliseconds() + "<br>";
        str += "Courant (A) : " + data_now["current"] + "<br>";
        for (j = 0; j < TOTAL_IC; j++) {
            str += "BMS " + String(j + 1) + "<br>";
            var strcell = "";
            for (k = 0; k < 12; k++) {
                strcell += "C" + String(k + 1) + ": " + data_now["IC" + String(j + 1)]["cell" + String(k + 1)] + ", ";
            }
            str += "Cellules (V) : " + strcell.substring(0, strcell.length - 2) + "<br>";
            var strtemp = "";
            for (k = 0; k < MAX_MUX; k++) {
                strtemp += "T" + String(k + 1) + ": " + data_now["IC" + String(j + 1)]["temp" + String(k + 1)] + ", ";
            }
            str += "Temp (°C) : " + strtemp.substring(0, strtemp.length - 2) + "<br>";
        }
        str += "<br>";
        read += str;
    }
    // console.log(read)
    return read;
}

//Read temp data
const Vref = 3;  // V
const R = 10000;  // Ohm
const V_error = 0.0305;  // V
var temp_csv = undefined;
const csv = d3.dsvFormat(";");
function loadTempFunc(filePath) {
    const req = new XMLHttpRequest();
    req.open("GET", filePath, true);
    req.onload = (event) => {
        temp_csv = csv.parse(req.responseText); // Note: not req.responseText
        // console.log(req.response.slice(0, 8))
        // console.log(temp_csv);
        var volt_temp = new Array(temp_csv.length);
        for (i = 0; i < temp_csv.length; i++) {
            x = temp_csv[i]["resistance"] * 1000;
            vt = new Array(2);
            vt[0] = x / (x + R) * Vref;
            vt[1] = temp_csv[i]["temperature"];
            volt_temp[i] = vt;
        }
        volt_temp.sort();
        var voltage_sorted = [];
        var temperature_sorted = [];
        for (i = 0; i < temp_csv.length; i++) {
            voltage_sorted.push(volt_temp[i][0]);
            temperature_sorted.push(volt_temp[i][1]);
        }
        temp = function (value) {
            spline = new Spline(voltage_sorted, temperature_sorted);
            return spline.at(value);
        };

    };
    req.send();
}
function temp(value) {
    console.log("Non chargé");
}
// function Spline(xs, ys) {
//     ks = CSPL.getNaturalKs(xs, ys, new Float64Array(xs.length))
//     return function (x) {
//         CSPL.evalSpline(x, xs, ys, ks)
//     }
// }
loadTempFunc(path + 'RT_table.csv');

document.addEventListener("DOMContentLoaded", function () {
    const scrollBox = document.getElementById("main");
    scrollBox.scrollTop = scrollBox.scrollHeight;

    // Optionally, keep scrolling as new content is added
    // const observer = new MutationObserver(() => {
    //     scrollBox.scrollTop = scrollBox.scrollHeight;
    // });

    // observer.observe(scrollBox, { childList: true });
});



loadData(path + "actualdata.bin");
