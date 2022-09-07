/*
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/
//Testen auf der Konsole von node.js
'use strict';
class myServer{
    constructor(message = "Hallo Welt!",hostname = "127.0.0.1",port = 3000) {
        this.http = require('http');
        this.hostname = hostname;
        this.port = port;


        this.server = this.http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'html');
            res.end(`<h1>${message}</h1>`);
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

