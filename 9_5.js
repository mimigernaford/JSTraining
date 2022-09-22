        'use strict';

        //------------- ---------------------------------------------
        //Variante von 58_classKfz.html
        class KFZ{
            //------------- ---------------------------------------------
            constructor(marke,color,doors,step) {
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
                this.Gang = step;
            }//Ende des Konstruktors
            //------------- ---------------------------------------------
            //eine Methode im body der Klasse wird wie eine function aber ohne die Schlüsselwörter function und this deklariert
            Bremsen(){
                console.log("Methode Bremsen der Superklasse von " +this.marke);
                this.Bremsen.xb = 1;
                this.Bremsen.xc = -1;
            }
            //eine Eigenschaft via "getter", diese Funktion darf nicht im Konstruktor stehen
            get KfzBez(){return this.marke +" "+ this.Typ} //"getter" -> der Funktionsname wird zum Eigenschaftsnamen

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
            constructor(sitze,doors,typ, marke,color,ps,step) {
            super(marke,color = color || "weiß", doors = doors || 2,step = step || 1);//Reihenfolge!! : KFZ-->constructor(marke,color,tueren)
            this.PS = ps || 45;// this. darf erst verwendet werden, wenn super() aufgerufen wurde

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

            this.Bremsen2 = super.Bremsen;//Methoden der Superklasse holen
            //this.Bremsen = super.Bremsen;
                //wenn aktiv, dann wird die Methode der Subklasse (s.u.) ignoriert
            }//Ende constructor
            //Methode Bremsen der Subklasse überschreibt super.Bremsen()??
            Bremsen(){
                console.log("Subklasse Methode Bremsen von " +this.marke)
            }
        }

        //Zweirad: 9.5.3 Delegieren statt Vererben: Wrapping/Komposition
        /*
        das erzeugte Objekt ist keine Instanz von KFZ
        let Harley = new KRAD()
        Harley instanceof KFZ
         */
        class KRAD{
            constructor(radzahl) {
                this.krad = new KFZ(marke="Puch","black",0,4);//Delegieren statt Vererben: Wrapping/Komposition
                this.radzahl = radzahl || 2;
            }
        }
KFZ.prototype.setGang = (step) => {console.log(`Gang ${step} einlegen!`); this.Gang = step}
PKW.prototype.Radio = (sender)=>{console.log(sender)}
/*

Z.Radio("WDR 2")
let Y = new PKW(4,5,null,"Opel",null);
let Opel = new PKW(4,5,"1.6G 16V elegance","Opel","Marseillerot");
Y instanceof PKW;
let Z = new PKW()
Object.getOwnPropertyDescriptor(Z, "Doors").writable; //Singular/Plural bei Descriptors beachten!!
 */
