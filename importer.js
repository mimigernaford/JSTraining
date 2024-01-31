// 📁 javascriptImporter.js https://javascript.info/import-export
'use strict';//nicht notwendig, weil: In einem ES6-Modul verwendet der Code automatisch den strict-Modus
//import KFZ from './class.KFZ.js';
/*import {PKW_2} from './class.PKW.js';
import {PKW} from './class.PKW.js';
* */
//oder:
import {PKW, PKW_2} from './class.PKW.js';

import {data} from './data.js';
//import {functionContainer} from './practice.js'; -> class.KFZ.js
/* ************************************************************* */
//Hebt die erzeugten Instanzen in den globalen Scope.
//Ermöglicht globalen Zugriff, nur in Ausnahmefällen und Tests benutzen!
let cars = new Map();
let cars2 = new Map();
window.CARS = cars;
window.CARS2 = cars2;
window.Datas = data;
console.log("Alle Elemente von CARS/Datas befinden sich im globalen Objekt window.CARS/window.CARS2/window.Datas (Map cars2)");
//normalefunktion();//aus importSineEx.js -> wird nicht ausgeführt, ist aber vorhanden => type="text/javascript" in js_1.html
//und nicht erreichbar, wenn type="module"
/* ************************************************************* */
//cars aus data befüllen:
(() => {
    //Test: alternatives Auslesen einer Map
    for (const [key, val] of data) {
        console.log(`${key} -> ${val.modell}`)
    }
    //Standard
    for (const element of data) {
        //--------------------------------------------
        console.log(`"${element[0]}" als Identifier`);
        /*console.log(`"${element[1]}" das Objekt`);
        console.log(`"${element[1].type}" als Objekteigenschaft`);*/
        //--------------------------------------------
        //Erzeugen der Instanzen
        //Test mit class.KFZ wenn KFZ nur über class.PKW importiert wurde:
        //let allgKFZ = new KFZ(data.get(element[0])); ->Fehler

        //------------------
        let meinAuto = new PKW(data.get(element[0]));//element[0] = der Bezeichner ("key") der Map in data; element[1] = Daten als Objekte in JSON
        let meinAuto2 = new PKW_2(data.get(element[0]));
        //Ausgabe im DOM
        let li = document.createElement("li");
        let li2 = document.createElement("li");
        li.textContent = `Mein ${meinAuto.Marke}_Vererbung/extends ${meinAuto.Modell}  ist ein ${meinAuto.Typ}, hat ${meinAuto.Doors} Türen und ist ${meinAuto.Farbe}!`;
        li2.textContent = `Mein ${meinAuto2.Marke}_Wrapping/Komposition ${meinAuto2.Modell}  ist ein ${meinAuto2.Typ}, hat ${meinAuto2.Doors} Türen und ist ${meinAuto2.Farbe}!`;
        document.getElementsByTagName("ol")[0].appendChild(li);
        document.getElementsByTagName("ul")[0].appendChild(li2);
        //Transfer in den globalen Scope:
        cars.set(element[0], meinAuto);
        cars2.set(element[0], meinAuto2);

        console.log(`meinAuto instanceof PKW/PKW_2? = ${meinAuto2 instanceof PKW_2}/${meinAuto instanceof PKW}`);//(true false)
        //console.log(`meinAuto2 instanceof PKW_2? = ${meinAuto2 instanceof PKW_2}`);   //false??!!

    }
})()
