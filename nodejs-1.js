//Testen auf der Konsole von node.js
//2 Varianten

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('{x:1}');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



'use strict';
class myServer{
    constructor(message = "Hallo Welt!",hostname = "127.0.0.1",port = 3030) {
        this.http = require('http');
        this.hostname = hostname;
        this.port = port;
        this.html = "<!DOCTYPE html>\n<h1>HuHu</h1>" +
            "<h2>Text H2 </h2>" +
            "<p>HuHu</p>";

        this.server = this.http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'html');
            res.end(this.html);


        });
    }
    Listen() {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }

    class myServer{
    constructor(message = "Hallo Welt!",hostname = "127.0.0.1",port = 3030) {
        this.http = require('http');
        this.hostname = hostname;
        this.port = port;
        this.html = "<!DOCTYPE html><h1>HuHu</h1>" +
            "<h2>Text H2 </h2>" +
            "<p>HuHu</p>";

        this.server = this.http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'html');
            res.end(this.html);


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