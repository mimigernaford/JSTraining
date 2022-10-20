/*
====================================
         Ephemeris Calculation
       for Sun, Moon and Planets
====================================
Javascript (ES2020)
© Michael Dütting 2022
created: 2022-09-28
last modified: 2022-09-29
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
                                mercury:{
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
                                venus:{
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
                                earth:{
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
                                mars:{
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
                                jupiter:{
                                    perihelDate     :46600.5,
                                    inclination     :0.0228027,
                                    ascendingNode   :1.7549514,
                                    perihel         :0.2698787,
                                    meanAnomaly     :5.7230009,
                                    eccentricity    :0.048091,
                                    meanVelocity    :1.45029e-3,
                                    semiMajorAxis   :5.202629,
                                    name            :"Jupiter"
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
    //methods--------------------------------------------------------------------------------

    setJulianischesDatumJd(mantime=Date.now()){
        this.manDateData=(typeof mantime != "number")?mantime.split(","):null;
        this.JULIANISCHESDATUM.mantime  = (this.manDateData == null)?mantime:new Date(...this.manDateData).getTime();//unixtime now
        this.JULIANISCHESDATUM.JD       = this.JULIANISCHESDATUM.mantime /86400000 + 2440587.5;
        this.JULIANISCHESDATUM.normal   = (this.manDateData == null)?(()=>{return new Date()})():(()=>{return new Date(...this.manDateData)})();
        this.JULIANISCHESDATUM.dateArr  = (this.manDateData == null)?(()=>{return new Date().toString().split(" ")})():(()=>{return new Date(...this.manDateData).toString().split(" ")})();
        this.JULIANISCHESDATUM.dateArrL = (this.manDateData == null)?(()=>{return new Date().toLocaleString().split(" ")})():(()=>{return new Date(...this.manDateData).toLocaleString().split(" ")})();
    }


    //calc-----------------------------------------------------------------------------------




    //class variables
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
    //output---------------------------------------------------------------------------------
    Init(mantime){
        //mantime = "1978,1,12,23,35,0"
        this.setJulianischesDatumJd(mantime);
        this.OutputBrowser();
    }
    //in node.js cli
    Output(){
        console.log(`Date = ${this.JULIANISCHESDATUM.dateArrL[0]}  ${this.JULIANISCHESDATUM.dateArrL[1]}\nJulian Date now = ${this.JULIANISCHESDATUM.JD}`);
        console.log(`Day = ${this.GermDay.get(this.JULIANISCHESDATUM.dateArr[0])}\nMonth = ${this.GermMon.get(this.JULIANISCHESDATUM.dateArr[1])}`);
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
    console.log(JDnow.Output());
    console.log(JDnow.solarsystem.mars);
}