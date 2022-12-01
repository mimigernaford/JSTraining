/*
====================================
         Ephemeris Calculation
       for Sun, Moon and Planets
====================================
Javascript (ES2020)
© Michael Dütting 2022
created: 2022-09-28
last modified: 2022-12-01
 */
'use strict';
//CLASS
class EPHEM{
//constructor--------------------------------------------------------------------------------
    constructor(){
    //data

    //solarsystem----------------------------------------------------------------------------
    this.solarsystem        = {
                                selectedObject      :{
                                    name            :null
                                },
                                Sonne               :{
                                    name            :"Sonne"
                                },
                                Mond                :{
                                    name            :"Mond"
                                },
                                Mercury             :{
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
                                Venus               :{
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
                                Erde               :{
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
                                Mars                :{
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
                                Jupiter             :{
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
                                Saturn              :{
                                    perihelDate     :46600.5,
                                    inclination     :0.0434238,
                                    ascendingNode   :1.9835651,
                                    perihel         :1.6024533,
                                    meanAnomaly     :2.6642521,
                                    eccentricity    :0.052072,
                                    meanVelocity    :5.831913e-4,
                                    semiMajorAxis   :9.547464,
                                    name            :"Saturn"
                                },
                                Uranus 	            :{
                                    perihelDate     :46600.5,
                                    inclination     :0.0134931,
                                    ascendingNode   :1.2975635,
                                    perihel         :3.0400461,
                                    meanAnomaly     :1.414612,
                                    eccentricity    :0.045874,
                                    meanVelocity    :2.03741e-4,
                                    semiMajorAxis   :19.246083,
                                    name            :"Uranus"
                                },
                                Neptun              : {
                                   perihelDate      :46630.0,
                                   inclination      :0.0309482,
                                   ascendingNode    :2.2999061,
                                   perihel          :0.2371241,
                                   meanAnomaly      :4.5683278,
                                   eccentricity     :0.008449,
                                   meanVelocity     :1.036272e-4,
                                   semiMajorAxis    :30.205013,
                                   name             :"Neptun"
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
        this.extend(DUETT); //extend im constructor vererbt Erweiterungen auf die Instanzen
    }//constructorEND
    /* =================================================================================== */
    //class variables------------------------------------------------------------------------
    get GermDay(){
        return new Map([
            ["Mon","Montag"],    ["Tue","Dienstag"],
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
    get Constellation(){
        return new Map([
            ["Ari",["Widder",28,51,"aries","Aries"]],                                           ["Tau",["Stier",52,90,"bull","Taurus"]],
            ["Gem",["Zwillinge",91,120,"twins","Gemini"]],                                      ["Cnc",["Krebs",121,138,"cancer","Cancer"]],
            ["Leo",["L"+String.fromCharCode(246)+"we",139,175,"lion","Leo"]],             ["Vir",["Jungfrau",176,215,"virgin","Virgo"]],
            ["Lib",["Waage",216,238,"balance","Libra"]],                                        ["Sco",["Skorpion",239,246,"scorpio","Scorpius"]],
            ["Sgr",["Sch"+String.fromCharCode(252)+"tze",267,302,"archer","sagittarius"]],["Cap",["Steinbock",303,329,"capricorn","Capricornus"]],
            ["Oph",["Schlangentr"+String.fromCharCode(228)+"ger",247,266,"ophiuchus","Ophiuchus"]]
        ]);
    }
    //methods--------------------------------------------------------------------------------
    /* 				Calc Julian Date 12:00 MEZ				                               */
    setJulianischesDatumJd(mantime= Date.now()){
        this.manDateData                = (typeof mantime != "number")?mantime.split(","):this.manDateData;
        this.JULIANISCHESDATUM.mantime  = (this.manDateData == null)?mantime:new Date(...this.manDateData).getTime();//unixtime now
        this.JULIANISCHESDATUM.JD       = this.JULIANISCHESDATUM.mantime /86400000 + 2440587.5;
        this.JULIANISCHESDATUM.normal   = (this.manDateData == null)?(()=>{return new Date()})():(()=>{return new Date(...this.manDateData)})();
        this.JULIANISCHESDATUM.dateArr  = (this.manDateData == null)?(()=>{return new Date().toString().split(" ")})():(()=>{return new Date(...this.manDateData).toString().split(" ")})();
        this.JULIANISCHESDATUM.dateArrL = (this.manDateData == null)?(()=>{return new Date().toLocaleString().split(" ")})():(()=>{return new Date(...this.manDateData).toLocaleString().split(" ")})();
        (this.manDateData != null)?this.startTester(this.manDateData):void(0);
    }
    //---------------------------------------------------------------------------------------
    startTester(...mandatedata){
        console.log(`startTester (arguments[0] = ...mandatedata -> is_array?): ${DUETT.is_array(mandatedata)}`);
        for(var x in arguments[0]){
            (typeof arguments[0][x] != "function")?
            console.log(`startTester1 (): ${x} ->${typeof arguments[0][x]} wert -> ${arguments[0][x]}`):null;
            (typeof arguments[0][x] != "function")?
            console.log(`startTester2 -> wert -> ${arguments[0][x]}`):null;
        }
    }
    /*              Calc constellation                                                     */
    calcCon(solarsystemObject){
        solarsystemObject.con = "Psc";
        this.Constellation.forEach((entries,key,values)=>{
        solarsystemObject.con =  (entries[1] <= solarsystemObject.RA*15 && solarsystemObject.RA*15 <= entries[2])?this.Constellation.get(key):solarsystemObject.con;
        });
    }
    //---------------------------------------------------------------------------------------
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
    /* 					               calc Sun             							   */
    Helios(){
        let Datum 				        = this.JULIANISCHESDATUM.JD - 2447891.5;
        let AE 					        = 149598500;
        let omega1 				        = 279.403303 * this.altgrad;
        let omega2 				        = 282.768422 * this.altgrad;
        let mittlereSonne 		        = 360*this.altgrad/365.242191*Datum+omega1-omega2;
        let omega3				        = mittlereSonne+360*this.altgrad/Math.PI*this.solarsystem.Erde.eccentricity * Math.sin(mittlereSonne);
        let RektaszensionStunde;
        let RektaszensionMinute;
        this.solarsystem.Sonne.laenge	= this.Pi2(omega3+omega2);
        this.solarsystem.Sonne.breite	= 0;
        this.solarsystem.Sonne.Anomalie = mittlereSonne;
        this.TransformKoords();                      //Sonne = default
        //coordinates-------------------------------------------------
        //Right ascension
        this.solarsystem.Sonne.RA 		= this.solarsystem.Sonne.RA * ((180/Math.PI)/15);
        let raminute 			        = (this.solarsystem.Sonne.RA - Math.floor(this.solarsystem.Sonne.RA))*60;
        RektaszensionStunde             = (this.solarsystem.Sonne.RA < 0)?Math.ceil(this.solarsystem.Sonne.RA):Math.floor(this.solarsystem.Sonne.RA);
        (raminute >= 59.5)?(()=>{RektaszensionStunde++;raminute -= 60;})():null;
        RektaszensionMinute 	        = Math.round(raminute);
        //--------------------------------------------------------------
        //Declination
        let solDKL                      = this.solarsystem.Sonne.DK*(180/Math.PI); //to degrees [float]
        let solDKLsign                  = (solDKL>0)?"+":"-";//string sign
        let solDKLunsign                = (solDKL<0)?solDKL*-1:solDKL;//degrees [float] unsign
        let solDKLString_1              = (parseInt(solDKLunsign)<10 || parseInt(solDKLunsign) == 0)?"0"+parseInt(solDKLunsign):parseInt(solDKLunsign);
        //minutes
        let solDKLmin                   = parseInt((solDKLunsign - Math.floor(solDKLunsign))*60);//[integer] minutes
        let solDKMString_1              = (solDKLmin<10 || solDKLmin == 0)?"0"+solDKLmin:solDKLmin;
        //---------------------------------------------------------------
        //computed
        this.solarsystem.Sonne.Rektaszension    = `${RektaszensionStunde} h  ${RektaszensionMinute} m`;
        this.solarsystem.Sonne.Deklination      = `${solDKLsign}${solDKLString_1}${String.fromCharCode(176)} ${solDKMString_1}'`;
        this.calcCon(this.solarsystem.Sonne);
    }
    /* =================================================================================== */
    /* 					               calc Moon             							   */
    Luna(){
    console.log(this.solarsystem.selectedObject.name);
    }
    /* =================================================================================== */
    /* 					               calc Planets           							   */
    Planet(){
    console.log(this.solarsystem.selectedObject.name);
    }
    //output---------------------------------------------------------------------------------
    Init(mantime){
        //mantime = "1978,1,12,23,35,0"
        this.setJulianischesDatumJd(mantime);
        this.solarsystem.selectedObject = this.solarsystem["Sonne"];
        this.OutputBrowser();
    }
    //in node.js cli
    //kein Objekt, dann Sonne; kein Datum, dann heute
    cliRun(solarsystemObject = "Sonne",mantime = Date.now()){
        this.setJulianischesDatumJd(mantime); //Datum der Berechnung, default heute s.o.
        this.solarsystem.selectedObject = this.solarsystem[solarsystemObject];//das ausgewählte Objekt, default Sonne s.o.
        (solarsystemObject == "Mond")?this.Luna():(solarsystemObject != "Sonne")?this.Planet():this.Helios();
        this.Output();
    }
    Output(){

        console.log(`Datum = ${this.JULIANISCHESDATUM.dateArrL[0]} ${this.JULIANISCHESDATUM.dateArrL[1]}\naktuelles Julianisches Datum = ${this.JULIANISCHESDATUM.JD}`);
        console.log(`Tag = ${this.GermDay.get(this.JULIANISCHESDATUM.dateArr[0])}\nMonat = ${this.GermMon.get(this.JULIANISCHESDATUM.dateArr[1])}`);
        console.log(`Tagnorm = ${this.JULIANISCHESDATUM.normal}`);
        console.log(`Objekt: ${this.solarsystem.selectedObject.name}\nRektaszension ${this.solarsystem.selectedObject.Rektaszension} Deklination ${this.solarsystem.selectedObject.Deklination}`);
        console.log(`Sternbild: ${this.solarsystem.selectedObject.con[0]} [${this.solarsystem.selectedObject.con[4]}]`);

    }
    //-- output in browser
    OutputBrowser(){
        console.log("dayname: "+ this.JULIANISCHESDATUM.dateArr[0]);
        let htmlMap = new Map([
            ["h1",{label:"Monat = ",data:this.GermMon.get(this.JULIANISCHESDATUM.dateArr[1])}],
            ["h2",{label:"Zeit = ",data:this.GermDay.get(this.JULIANISCHESDATUM.dateArr[0])+", "+this.JULIANISCHESDATUM.dateArrL[0] +" "+ this.JULIANISCHESDATUM.dateArrL[1] }],
            ["p",{label:"Julianisches Datum = ",data:this.JULIANISCHESDATUM.JD}],
            ["div",{label:"Normdatum = ",data:this.JULIANISCHESDATUM.normal}],
            ["div",{label:"Objekt = ",data:this.solarsystem.selectedObject.name}],
        ]);
        htmlMap.forEach((val,key)=>{
            let html            = document.createElement(key);
            html.textContent    =  val.label + val.data;
            document.getElementsByTagName("body")[0].appendChild(html);
        console.log(val);
        });
    }
}
//EPHEM.extend(DUETT); //dann nicht an die Instanz vererbt
//EPHEM.prototype.x = DUETT;// an die Instanz vererbt aber old style
//==============================start program=================================================
let JDnow = new EPHEM();
//JDnow.extend(DUETT);//zu fuss nur auf die Instanz
try{
    //some browser
    window.onload = () => {
    JDnow.Init();
    }
}
catch(err){
    //no browser environment
    JDnow.cliRun();
}


/*
.load classEphem.js
JDnow.cliRun()
JDnow.cliRun("1978,1,12,0,0,0")
JDnow.cliRun("1966,7,18,23,35,0")

//let JDnow = new EPHEM(1978,1,12,23,35,0);
//JDnow.setJulianischesDatumJd(yyyy,m,d,h,m,s);
//let u = new EPHEM().Output();
//for(let x in JDnow.solarsystem){console.log(JDnow.solarsystem[x].name)}
//for(var i of Object.values(JDnow.solarsystem)){console.log(i.name)}

var Arr_Z = []
for(var t in JDnow.solarsystem){
Arr_Z.push();
console.log(typeof t)
}

JDnow = new EPHEM("1978,1,12,23,35,0")


JDnow.setJulianischesDatumJd("2022,9,25,13,25,0");
//JDnow.setJulianischesDatumJd("1978,1,12,23,35,0");
JDnow.Helios();
JDnow.solarsystem.Sonne
//console.log(JDnow.solarsystem.mars);
 */