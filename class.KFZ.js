//-----------------------2023-05-16 MD------------------------------------------------
//eine "echte" Javascript-Klasse die via export als Modul von importer.js geladen wird
//export default class KFZ wenn Nutzung mit extends und/oder verschiedene Klassen in der Klassendatei, beim Import dann ohne {}
export default class KFZ {
    //-------------constructor------------------------------------------------
    constructor(selectedData = selectedData || 1) {
        //eine Eigenschaft mit Attributen im Konstruktor
        Object.defineProperty(this, 'Marke', {
            value: selectedData.marke || "Trabant",
            writable: false,
            enumerable: true,
            configurable: true
        });
        //eine Eigenschaft mit Attributen im Konstruktor
        Object.defineProperty(this, 'Typ', {
            value: selectedData.type || "102",
            writable: false,
            enumerable: true,
            configurable: true
        });
        //eine Methode im Konstruktor der Klasse wird mit this. deklariert: Syntax wie eine function
        //hier mit der Pfeilsyntax
        this.Fahren = (tempo) => {
            console.log(`Methode der erzeugten Instanz! ${this.Marke} fahren mit ${tempo} km/h`);
        };
        //einfache Deklaration einer Eigenschaft im Konstruktor
        this.Farbe = selectedData.color || "ohne Farbe...";
        this.Doors = selectedData.doors || 2;
        this.Gang = selectedData.step || -1;
    }

    //-------------end constructor--------------------------------------------
    //eine Methode im body der Klasse wird wie eine function aber ohne das Schlüsselwort function deklariert
    Bremsen() {
        console.log("Methode Bremsen von " + this.Marke);
        this.Bremsen.xb = 1;
        this.Bremsen.xc = 0;
    }

    Gargl() {
        console.log("Methode gargl von " + this.Marke);
        this.Gargl.z = 1;
        functionContainer.func_2(this.Marke);
    }

    //eine Eigenschaft via "getter", diese Funktion darf **nicht** im Konstruktor stehen
    get KfzBez() {
        return this.Marke + " " + this.Typ
    } //"getter" -> der Funktionsname wird zum Eigenschaftsnamen
}//Ende der Klasse KFZ
//=====================================================================================================================================================
//=====================================================================================================================================================
////via Delegieren statt Vererben: Wrapping/Komposition
export class KFZ_2 {
    //-------------constructor------------------------------------------------
    constructor(selectedData = selectedData || 1) {
        //eine Eigenschaft mit Attributen im Konstruktor
        Object.defineProperty(this, 'Marke', {
            value: selectedData.marke || "Trabant",
            writable: false,
            enumerable: true,
            configurable: true
        });
        //eine Eigenschaft mit Attributen im Konstruktor
        Object.defineProperty(this, 'Typ', {
            value: selectedData.type || "102",
            writable: false,
            enumerable: true,
            configurable: true
        });
        //eine Methode im Konstruktor der Klasse wird mit this. deklariert: Syntax wie eine function
        //hier mit der Pfeilsyntax
        this.Fahren = (tempo) => {
            console.log(`Methode der erzeugten Instanz! ${this.Marke} fahren mit ${tempo} km/h`);
        };
        //einfache Deklaration einer Eigenschaft im Konstruktor
        this.Farbe = selectedData.color || "ohne Farbe...";
        this.Doors = selectedData.doors || 2;
        this.Gang = selectedData.step || -1;
    }

    //-------------end constructor--------------------------------------------
    Bremsen() {
        console.log("Methode Bremsen aus KFZ_2 von " + this.Marke);
        this.Bremsen.xb = 1;
        this.Bremsen.xc = 0;
    }

    Gargl() {
        console.log("Methode Gargl aus KFZ_2 von " + this.Marke);
        this.Gargl.z = 1; //z.B. Fiat.Gargl.z
        functionContainer.func_2(this.Marke);//wurde importiert und kann von der
        //erzeugten Instanz aufgerufen werden. s.u. import {functionContainer} from './practice.js';
    }

    //eine Eigenschaft via "getter", diese Funktion darf **nicht** im Konstruktor stehen
    get KfzBez() {
        return this.Marke + " " + this.Typ
    } //"getter" -> der Funktionsname wird zum Eigenschaftsnamen


}//Ende der Klasse KFZ
//=====================================================================================================================================================
//=====================================================================================================================================================
//Test
/*import {functionContainer} from './practice.js';
import {A,B,C} from './practice.js';*/
//oder
import {
    functionContainer,
    A, //unten wird noch eine Variable A importiert- die umbenannt wird.
    B,
    C
} from './practice.js';
//*****************************************************
import {
    A as A2, //A als A2, weil oben bereits ein "A" importiert wird.
    RECHNER
} from './rtempo.js';
/*
import { default as Histogram, mean, stddev } from "./histogram-stats.js";
Hierbei dient das JavaScript-Schlüsselwort default  als Platzhalter, mit dessen Hilfe
wir den Standardexport des Moduls im portieren und ihm einen eigenen Namen geben können.
Außerdem können Werte beim Export umbenannt werden. Das funktioniert allerdings
nur, wenn Sie die export-Variante mit geschweiften Klammern verwenden.
 */
//*****************************************************
functionContainer.func_4([1, 2, 3, 4, 5, 6]);
functionContainer.func_3();
functionContainer.func_2();
console.log(`A aus practice.js = ${A(1)}`);
console.log(`B aus practice.js = ${B(3)}`);
console.log(`C aus practice.js = ${C(4, 3)}`);
console.log(`(import in class.KFZ.js) A as A2+RECHNER aus rtempo.js = ${A2 + RECHNER} (Kapitel 10.3.3)`);
//****************************************************************
import {fC2} from './practice.js';
//Variante 2:
//fC2.Drucken("Text im Funktionsaufruf der importierten Funktion fC2 in class.KFZ.js, Quelle practice.js",4);
//zu Variante 1:
fC2("Text im Funktionsaufruf der importierten Funktion fC2 in class.KFZ.js, Quelle practice.js", -12);

let identifier = "identifier = Ich stehe in KFZ.js";
console.log(identifier);

//=====================================================================================================================================================

