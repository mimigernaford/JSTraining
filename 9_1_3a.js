        'use strict';

        //------------- ---------------------------------------------
        //Variante von 58_classKfz.html
        class KFZ{
            //------------- ---------------------------------------------
            constructor(marke,color,doors) {
                //eine Eigenschaft mit Attributen im Konstruktor
                Object.defineProperty(this, 'marke', {
                    value:marke || "Trabant",
                    writable: false,
                    enumerable:true,
                    configurable:true
                });
                //eine Methode im Konstruktor der Klasse wird mit this. deklariert: Syntax wie eine function
                //hier mit der Pfeilsyntax
                this.Fahren = () => {
                    console.log(this.marke+ " fahren");
                };
                //einfache Deklaration einer Eigenschaft im Konstruktor
                this.Farbe = color || "ohne Farbe...";
                this.Doors = doors || 2;


            }//Ende des Konstruktors
            //------------- ---------------------------------------------
            //eine Methode im body der Klasse wird wie eine function aber ohne die Schlüsselwörter function und this deklariert
            Bremsen(){
                console.log("Methode Bremsen von " +this.marke)
            }
            //eine Eigenschaft via "getter", diese Funktion darf nicht im Konstruktor stehen
            get KfzBez(){return this.marke + this.Typ} //"getter" -> der Funktionsname wird zum Eigenschaftsnamen
        }//Ende der Klasse

        /*
        "Subklassen"
        eine KFZ erweiternde (Sub) Klasse PKW
        hat KFZ einen Konstruktor muss in PKW "super" gesetzt werden
        eigentlicher Konstruktor ist dann jener, der erweiterten Klasse (Oberklasse/Superklasse = KFZ)
        die Parameter für die Oberklasse werden mit super() übergeben
        extends ist quasi die Kurzform der klassischen Erweiterng mit Object.create(): var v = Object.create(w);//w wird Prototyp von v
        s. 15_object.html
        */
        class PKW extends KFZ{
            constructor(sitze,doors,typ, marke,color) {
            super(marke,color = color || "weiß", doors = doors || 2);//Reihenfolge!! : KFZ-->constructor(marke,color,tueren)
            Object.defineProperty(this,"Sitze",{
                value:sitze || 4,
                writable:false,
                enumerable:true,
                configurable:true
                });
            Object.defineProperty(this,"Typ",{
                value:typ || "coupe",
                writable:false,
                enumerable:true,
                configurable:false
                });
            }
        }
/*
KFZ.prototype.setGang = (step) => {console.log(`Gang ${step} einlegen!`)}
PKW.prototype.Radio = (sender)=>{console.log(sender)}
Z.Radio("WDR 2")
Y instanceof PKW,
let Z = new PKW()
 */
