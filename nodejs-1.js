/*
Import/Export mit node.js
"require" anstatt "import" wie in ES2020
Im Gegensatz zu ES2020 muss der import nicht im globalen Scope des geladenen Moduls (Skript) stehen,
sondern darf auch z. B. in einer Klasse verwendet werden.
*/
//Testen auf der Konsole von node.js
//2 Varianten

//Variante 1
/*
const http = require('http');
const {data} = require("./data");
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>{x:400}</h1>');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});*/
//--/Variante 1

//Variante 2
'use strict';

class myServer {
    constructor(message = "Hallo Welt!", hostname = "127.0.0.1", port = 3030) {
        const Data = require('./data.js');//Import des Moduls "Daten"
        const Kats = require('./kategorien.js');//Import des Moduls "Kategorien"
        this.http = require('http');
        this.hostname = hostname;
        this.port = port;
        this.textData   = "<p>*********** Methode 1 *********************</p>";

        this.textData += "<ul>";
        //Map aufschlüsseln
        for (const element in Data){
                this.X = Array.from(Data[element]);//Umwandlung der Map in Array
                for(let daten of this.X){
                    this.textData += "<li><ul>"+daten[0];

                       for(let fields in daten[1]){
                        this.textData += "<li>" +fields+ " &rarr; " +daten[1][fields]+ "</li>"   
                       }
                    this.textData += "</ul></li>";
                }
           }
        this.textData += "</ul>";
        this.Kategorien = "<p>*********** Methode 2 *********************</p>";
        this.Kategorien += "<ul>";
        for(let yy in Kats.Kategorien){
            this.Kategorien += "<li>" +yy+ " &rarr; <ul>";
                for(let xy in Kats.Kategorien[yy]){
                this.Kategorien += `<li>${xy} &rarr; ${Kats.Kategorien[yy][xy]}</li>`;
                }
        this.Kategorien += "</ul>";

                //geht auch:
/*                this.Y = Array.from(Kats[element]);//Umwandlung der Map in Array
                this.Y.forEach((ydata)=>{
                    let yy = Array.from(ydata);
                    this.Kategorien += `<li>&rarr; ${yy[0]} &rarr; ${yy[1].type}`;//[1] = Map-entry Object aus data .eigenschaft
                    this.Kategorien += `<ul>`;
                        for(let attr in yy[1]){
                            this.Kategorien += `<li>${attr} &rarr; ${yy[1][attr]}</li>`;
                            };

                    this.Kategorien += `</ul>`;
                    this.Kategorien += `</li>`;
                });*/

        }
            
        
        this.textData += this.Kategorien;

        this.html = `<!DOCTYPE html>\n` +
                    `<head>
                    <meta charset="utf-8" /> 
                    </head>
                    <body>
                    `+
                    "<h1>Aufschlüsselung eines MAP-Objektes aus einem importierten Modul</h1>" +
                    "<h2>Methode 1: for in / for of</h2>" +
                    "<h2>Methode 2 forEach / for in</h2>" +
                    "<h2>Methode 1+2 Array.from()</h2>" +
                    this.textData
                    +`</body>\n</html>`;
        this.server = this.http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'html');
            res.end(this.html);
            //console.log(`Server running at http://${this.hostname}:${this.port}/`);

        });
    }

    Listen() {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}

let X = new myServer();
X.Listen();





//10.2.1 Node-Exporte
/*

const sum=(x,y)=>x+y;
const square=x=>x*x;
module.exports.mean = data => data.reduce(sum)/data.length;
module.exports.stddev = function(d) {
let m = exports.mean(d);
return Math.sqrt(d.map(x => x - m).map(square).reduce(sum)/(d.length-1));
};
Test: module.exports.mean([1,2,3,6,8])

Oftmals soll jedoch ein Modul definiert werden, das kein Objekt voller Funktionen und Klassen exportiert, sondern nur eine
 einzelne Funktion. Hierfür können Sie module.exports einfach diesen Einzelwert zuweisen:
module.exports = class BitSet extends AbstractWritableSet {
// Implementierung weggelassen.
}

272
|
Kapitel 10: Module
// Alle (öffentlichen und privaten) Funktionen definieren.
const sum = (x, y) => x + y;
const square=x=>x*x;
const mean = data => data.reduce(sum)/data.length;
const stddev = d => {
let m = mean(d);
return Math.sqrt(d.map(x => x - m).map(square).reduce(sum)/(d.length-1));
};
// Und nur die öffentlichen Funktionen exportieren:
module.exports={mean, stddev };
//Test
module.exports.mean([2,3,4,5])

 */