/*
====================================
         Ephemeris Calculation
       for Sun, Moon and Planets
====================================
Javascript (ES2020)
© Michael Dütting 2022
created: 2022-09-28
last modified: 2022-10-26
 */
'use strict';
//CLASS
class EPHEM{
//constructor--------------------------------------------------------------------------------
    constructor(){
    //data

    //solarsystem----------------------------------------------------------------------------

    //	//                  Periheldatum,Inklination, Knotenlänge,  Perihel,   mittlereAnomalie,   Exzentrizitaet, mittlereBewegung, grosseHalbachse,  Name
        //                  perihelDate  inclination ascendingNode  perihel    meanAnomaly         eccentricity,   meanVelocity       SemiMajorAxis
    // ErdeE = new PLANET_E(    47893,        0,          0,       1.7936477,  6.2330541,          0.0167134,      1.7202111e-2,         1.0,          "Erde");
    // MarsE = new PLANET_E(    47892.7,  0.0322837, 0.8635947,    5.8621241,  4.6275694,           0.0933958,      9.146107e-3,        1.523691,       "Mars")
    this.solarsystem        = {
                                Sonne               :{},
                                Mond                :{},
                                mercury             :{
                                    perihelDate     :47893,
                                    inclination     :0.1222525,
                                    ascendingNode   :0.84147123,
                                    perihel         :1.3491371,
                                    meanAnomaly     :6.0300596,
                                    eccentricity    :0.2056326,
                                    meanVelocity    :0.071424788,
                                    semiMajorAxis   :0.387099,
                                    name            :"Merkur"
                                },
                                venus               :{
                                    perihelDate     :47893,
                                    inclination     :0.0592457,
                                    ascendingNode   :1.3367448,
                                    perihel         :2.2938906,
                                    meanAnomaly     :5.5471223,
                                    eccentricity    :0.0067777,
                                    meanVelocity    :0.027962453,
                                    semiMajorAxis   :0.723332,
                                    name            :"Venus"
                                },
                                earth               :{
                                    perihelDate     :47893,
                                    inclination     :0,
                                    ascendingNode   :0,
                                    perihel         :1.7936477,
                                    meanAnomaly     :6.2330541,
                                    eccentricity    :0.0167134,
                                    meanVelocity    :1.7202111e-2,
                                    semiMajorAxis   :1.0,
                                    name            :"Erde"
                                },
                                mars                :{
                                    perihelDate     :47892.7,
                                    inclination     :0.0322837,
                                    ascendingNode   :0.8635947,
                                    perihel         :5.8621241,
                                    meanAnomaly     :4.6275694,
                                    eccentricity    :0.0933958,
                                    meanVelocity    :9.146107e-3,
                                    semiMajorAxis   :1.523691,
                                    name            :"Mars"
                                },
                                jupiter             :{
                                    perihelDate     :46600.5,
                                    inclination     :0.0228027,
                                    ascendingNode   :1.7549514,
                                    perihel         :0.2698787,
                                    meanAnomaly     :5.7230009,
                                    eccentricity    :0.048091,
                                    meanVelocity    :1.45029e-3,
                                    semiMajorAxis   :5.202629,
                                    name            :"Jupiter"
                                },
                                saturn              :{
                                    perihelDate     :46600.5,
                                    inclination     :0.0434238,
                                    ascendingNode   :1.9835651,
                                    perihel         :1.6024533,
                                    meanAnomaly     :2.6642521,
                                    eccentricity    :0.052072,
                                    meanVelocity    :5.831913e-4,
                                    semiMajorAxis   :9.547464,
                                    name            :"Saturn"
                                }

                            }
    //---------------------------------------------------------------------------------------
    this.JULIANISCHESDATUM  = {
                                JD          :null,
                                normal      :null,
                                manDateData :null,
                                wert        :0,
                            }
    //helper functions
    this.Modify             = (m1,m2)   => {return (m1 - Math.floor(m1 / m2) * m2);}
    this.Pi2 	            = (x)       => {return this.Modify(x,2*Math.PI);}
    this.Positiv            = (f)       => {return (f<0)?-1:f}
    this.altgrad 	        = Math.PI / 180;//DEG


    }//constructorEND
    /* =================================================================================== */
    //class variables------------------------------------------------------------------------
    get GermDay(){
        return new Map([
            ["Mo","Montag"],    ["Tue","Dienstag"],
            ["Wed","Mittwoch"], ["Thu","Donnerstag"],
            ["Fri","Freitag"],  ["Sat","Samstag"],
            ["Sun","Sonntag"]
        ]);
    }
    get GermMon(){
        return new Map([
            ["Jan","Januar"],   ["Feb","Februar"],  ["Mar","März"],     ["Apr","April"],
            ["May","Mai"],      ["Jun","Juni"],     ["Aug","August"],   ["Sep","September"],
            ["Oct","Oktober"],  ["Nov","November"], ["Dec","Dezember"]
        ]);
    }
    //methods--------------------------------------------------------------------------------
    /* 				Calc Julian Date 12:00 MEZ				                               */
    setJulianischesDatumJd(mantime= Date.now()){
        this.manDateData=(typeof mantime != "number")?mantime.split(","):null;
        this.JULIANISCHESDATUM.mantime  = (this.manDateData == null)?mantime:new Date(...this.manDateData).getTime();//unixtime now
        this.JULIANISCHESDATUM.JD       = this.JULIANISCHESDATUM.mantime /86400000 + 2440587.5;
        this.JULIANISCHESDATUM.normal   = (this.manDateData == null)?(()=>{return new Date()})():(()=>{return new Date(...this.manDateData)})();
        this.JULIANISCHESDATUM.dateArr  = (this.manDateData == null)?(()=>{return new Date().toString().split(" ")})():(()=>{return new Date(...this.manDateData).toString().split(" ")})();
        this.JULIANISCHESDATUM.dateArrL = (this.manDateData == null)?(()=>{return new Date().toLocaleString().split(" ")})():(()=>{return new Date(...this.manDateData).toLocaleString().split(" ")})();
    }
    /* 	      transform ecliptic to equatorial coordinates for Helios() Sonne = default    */
    TransformKoords(solarsystemObject = this.solarsystem.Sonne){
        let Epoche 		                = (this.JULIANISCHESDATUM.JD - 2451545.0) / 36525;
        let Ekliptik 	                = (23+(26+21.45/60)/60 + Epoche * (-46.815 + Epoche * (-0.0006 + Epoche * 0.00181))/3600) * this.altgrad;
        let cosEkliptik                 = Math.cos(Ekliptik);
        let sinEkliptik                 = Math.sin(Ekliptik);
        let sinLaenge	                = Math.sin(solarsystemObject.laenge);
        solarsystemObject.RA            = this.Pi2(Math.atan2((sinLaenge*cosEkliptik-Math.tan(solarsystemObject.breite)*sinEkliptik),Math.cos(solarsystemObject.laenge)));
        solarsystemObject.DK            = Math.asin(Math.sin(solarsystemObject.breite)*cosEkliptik+Math.cos(solarsystemObject.breite)*sinEkliptik*sinLaenge);
       // return this.solarsystem.Sonne;
    }
    //calc-----------------------------------------------------------------------------------
    /* =================================================================================== */
    /* 					calc Right ascension sun             							   */
    Helios(){
        let Datum 				        = this.JULIANISCHESDATUM.JD - 2447891.5;
        let omega1 				        = 279.403303 * this.altgrad;
        let omega2 				        = 282.768422 * this.altgrad;
        //Planet();
        let AE 					        = 149598500;
        let mittlereSonne 		        = 360*this.altgrad/365.242191*Datum+omega1-omega2;
        //var omega3				    = mittlereSonne+360*this.altgrad/Math.PI*Erde.Exzentrizitaet*Math.sin(mittlereSonne);
        let omega3				        = mittlereSonne+360*this.altgrad/Math.PI*this.solarsystem.earth.eccentricity * Math.sin(mittlereSonne);
        this.solarsystem.Sonne.laenge	= this.Pi2(omega3+omega2);
        this.solarsystem.Sonne.breite	= 0;
        this.solarsystem.Sonne.Anomalie = mittlereSonne;
        this.TransformKoords();//Sonne = default
        this.solarsystem.Sonne.RA 		= this.solarsystem.Sonne.RA * ((180/Math.PI)/15);
        let raminute 			        = (this.solarsystem.Sonne.RA - Math.floor(this.solarsystem.Sonne.RA))*60;
        let RektaszensionStunde;
        let RektaszensionMinute;
        if(this.solarsystem.Sonne.RA < 0)
        {RektaszensionStunde = Math.ceil(this.solarsystem.Sonne.RA);}
        else
        {RektaszensionStunde = Math.floor(this.solarsystem.Sonne.RA);}
        if(raminute >= 59.5)
        {RektaszensionStunde++;raminute -= 60;}
        RektaszensionMinute 	= Math.round(raminute);
        this.solarsystem.Sonne.Koordinaten		= RektaszensionStunde + "_" + RektaszensionMinute;
        //Sternbild(Sonne);
    }
    /* =================================================================================== */



    //output---------------------------------------------------------------------------------
    Init(mantime){
        //mantime = "1978,1,12,23,35,0"
        this.setJulianischesDatumJd(mantime);
        this.OutputBrowser();
    }
    //in node.js cli
    Output(){
        console.log(`Datum = ${this.JULIANISCHESDATUM.dateArrL[0]}  ${this.JULIANISCHESDATUM.dateArrL[1]}\naktuelles Julianisches Datum = ${this.JULIANISCHESDATUM.JD}`);
        console.log(`Tag = ${this.GermDay.get(this.JULIANISCHESDATUM.dateArr[0])}\nMonat = ${this.GermMon.get(this.JULIANISCHESDATUM.dateArr[1])}`);
    }
    //-- output in browser
    OutputBrowser(){
        let htmlMap = new Map([
            ["h1",{label:"Monat = ",data:this.GermMon.get(this.JULIANISCHESDATUM.dateArr[1])}],
            ["h2",{label:"Zeit = ",data:this.GermDay.get(this.JULIANISCHESDATUM.dateArr[0])+", "+this.JULIANISCHESDATUM.dateArrL[0] +" "+ this.JULIANISCHESDATUM.dateArrL[1] }],
            ["p",{label:"Julianisches Datum = ",data:this.JULIANISCHESDATUM.JD}],
            ["div",{label:"Normdatum = ",data:this.JULIANISCHESDATUM.normal}]
        ]);
        htmlMap.forEach((val,key)=>{
            let html            = document.createElement(key);
            html.textContent    =  val.label + val.data;
            document.getElementsByTagName("body")[0].appendChild(html);
        console.log(val);
        });
    }
}
//==============================start program=================================================
//let u = new EPHEM().Output();
//for(let x in JDnow.solarsystem){console.log(JDnow.solarsystem[x].name)}
//for(var i of Object.values(JDnow.solarsystem)){console.log(i.name)}
/*
var Arr_Z = []
for(var t in JDnow.solarsystem){
Arr_Z.push();
console.log(typeof t)
}

JDnow = new EPHEM("1978,1,12,23,35,0")
 */
let JDnow = new EPHEM();
//let JDnow = new EPHEM(1978,1,12,23,35,0);
//JDnow.setJulianischesDatumJd(/*yyyy,m,d,h,m,s*/);
try{
    //some browser
    window.onload = () => {
JDnow.Init()
    }
}
catch(err){
    //no browser environment
    JDnow.setJulianischesDatumJd();
    //JDnow.setJulianischesDatumJd("1978,1,12,23,35,0");
    console.log(JDnow.Output());
    console.log(JDnow.solarsystem.mars);
}