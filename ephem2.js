/*
############################################################
###                    planets.js                        ###
###         Javascript von Michael Duetting              ###
###                 copyright 2006                       ###

                für sternfreunde-muenster.de

            CMS              |----||----|
            Datenbanken      |    ||    |
                             |----||----|
            eShops                 |----|
                        |------|   |    |
            Webdesign   |      |   |----|
                        | multi|p l i c o
            Multimedia  |------|



###                  Telemannstr. 26                     ###
###                   48147 Münster                      ###
###             http://www.multiplico.de                 ###
############################################################
*/
/* =================================================================================== */
/* Diese GLOBALEN Variablen werden in den Funktionen Planet und PLANETS zu Objekten    */
var Merkur, Venus, Mars, Jupiter, Saturn, Uranus, Neptun, Pluto, Erde, terra1, terra2;
/* =================================================================================== */
var akObjekt		= new Object();//speichert Planetenauswahl für automatische Zeigeraktualisierung
var Sonne			= new Object();//globales Objekt
var Mond			= new Object();//globales Objekt
JULIANISCHESDATUM 	= new Object();//globales Objekt
altgrad 			= Math.PI / 180;//DEG
/* =================================================================================== */
/* 							Hilfsfunktionen 										   */
var Modifiziere 	= function(m1,m2){return (m1 - Math.floor(m1 / m2) * m2);}
var Pi2 			= function(x){x = Modifiziere(x,2*Math.PI);return x;}
/* =================================================================================== */
/* 	      Umwandlung ekliptikaler in äquatoriale Koordinaten für Helios()			   */
function TransformKoords()
{
var Epoche 		= (arguments[1] - 2451545.0) / 36525;
var Ekliptik 	= (23+(26+21.45/60)/60 + Epoche * (-46.815 + Epoche * (-0.0006 + Epoche * 0.00181))/3600) * altgrad;
var cosEkliptik = Math.cos(Ekliptik);
var sinEkliptik = Math.sin(Ekliptik);
var sinLaenge	= Math.sin(arguments[0].laenge);
arguments[0].RA = Pi2(Math.atan2((sinLaenge*cosEkliptik-Math.tan(arguments[0].breite)*sinEkliptik),Math.cos(arguments[0].laenge)));
arguments[0].DK = Math.asin(Math.sin(arguments[0].breite)*cosEkliptik+Math.cos(arguments[0].breite)*sinEkliptik*sinLaenge);
return arguments[0];
}
/* =================================================================================== */
/* 					Berechnet die Rektaszension der Sonne 							   */
function Helios()
{
var Datum 				= arguments[0] - 2447891.5;
var omega1 				= 279.403303 * altgrad;
var omega2 				= 282.768422 * altgrad;
Planet();
var AE 					= 149598500;
var mittlereSonne 		= 360*altgrad/365.242191*Datum+omega1-omega2;
var omega3				= mittlereSonne+360*altgrad/Math.PI*Erde.Exzentrizitaet*Math.sin(mittlereSonne);
Sonne.laenge			= Pi2(omega3+omega2);
Sonne.breite			= 0;
Sonne.Anomalie 			= mittlereSonne;
Sonne 					= TransformKoords(Sonne,JULIANISCHESDATUM.JD);
Sonne.RA 				= Sonne.RA * ((180/Math.PI)/15);
var raminute 			= (Sonne.RA - Math.floor(Sonne.RA))*60;
var RektaszensionStunde;
var RektaszensionMinute;
	if(Sonne.RA < 0)
	{RektaszensionStunde = Math.ceil(Sonne.RA);}
	else
	{RektaszensionStunde = Math.floor(Sonne.RA);}
	if(raminute >= 59.5)
	{RektaszensionStunde++;raminute -= 60;}
RektaszensionMinute 	= Math.round(raminute);	
Sonne.Koordinaten		= RektaszensionStunde + "_" + RektaszensionMinute;
Sternbild(Sonne);
akObjekt.wert = 11;
}
function HeliosAusgabe()
{
//Übergabe
autoPlanet(Sonne.Koordinaten);
}
/* =================================================================================== */
/* 				Berechnet Rektaszension, Deklination und Phase des Mondes  			   */
function Luna()
{
Helios(JULIANISCHESDATUM.JD);
Mond.Perihel 		= 36.340410*altgrad;
Mond.Knoten			= 318.510107*altgrad;
Mond.Inklination	= 5.145396*altgrad;
Mond.Exzentrizitaet	= 0.054900;
var Datum 			= JULIANISCHESDATUM.JD-2447891.5;
var laenge 			= 318.351648*altgrad;
var Laenge			= 13.1763966*altgrad*Datum+laenge;
var anomalie		= Laenge-0.1114041*altgrad*Datum-Mond.Perihel;	
var absteigend		= Mond.Knoten-0.0529539*altgrad*Datum;
var lage			= Laenge-Sonne.laenge;
var variation		= 1.2739*altgrad*Math.sin(2*lage-anomalie);
var Anomalie		= 0.1858*altgrad*Math.sin(Sonne.Anomalie);
var Xanomalie		= 0.37*altgrad*Math.sin(Sonne.Anomalie);
Mond.Anomalie		= anomalie+variation-Anomalie-Xanomalie;
var zentrum			= 6.2886*altgrad*Math.sin(Mond.Anomalie);
var Yanomalie		= 0.214*altgrad*Math.sin(2*Mond.Anomalie);
var korrektur		= Laenge+variation+zentrum-Anomalie+Yanomalie;
var Variation		= 0.6583*altgrad*Math.sin(2*korrektur-Sonne.laenge);
var wahreLaenge		= korrektur+Variation;
var aufsteigend		= absteigend-0.16*altgrad*Math.sin(Sonne.Anomalie);
Mond.laenge			= Pi2(aufsteigend+Math.atan2(Math.sin(wahreLaenge-aufsteigend)*Math.cos(Mond.Inklination),Math.cos(wahreLaenge-aufsteigend)));
Mond.breite			= Math.asin( Math.sin(wahreLaenge-aufsteigend)*Math.sin(Mond.Inklination));
Mond.Bahn			= wahreLaenge;
Mond				= TransformKoords(Mond,JULIANISCHESDATUM.JD);
Mond.RA						= Mond.RA * ((180/Math.PI)/15);
var raminute 				= (Mond.RA - Math.floor(Mond.RA))*60;
var RektaszensionStunde;
var RektaszensionMinute;
	if(Mond.RA < 0)
	{RektaszensionStunde 	= Math.ceil(Mond.RA);}
	else
	{RektaszensionStunde 	= Math.floor(Mond.RA);}
	if(raminute >= 59.5)
	{RektaszensionStunde++;raminute -= 60;}
RektaszensionMinute 		= Math.round(raminute);	
var RAZeiger 				= RektaszensionStunde + "_" + RektaszensionMinute;
Mond.Deklination 			= Math.floor(Mond.DK*(180/Math.PI));
/*Mondphase*/
Mond.Alter = Pi2(wahreLaenge-Sonne.laenge);
Mond.Phase = 0.5*(1-Math.cos(Mond.Alter));//1.0 = Vollmond
var Phase = 1/29.53*360*altgrad;
var phase = Modifiziere(Mond.Alter,90*altgrad);
	if(phase < Phase || phase > 90*altgrad-Phase)
	{phase = 2*Math.round(Mond.Alter/(90*altgrad));}
	else
	{phase = 2*Math.floor(Mond.Alter/(90*altgrad))+1;}
Sternbild(Mond);	
akObjekt.wert = 10;
//Übergabe-> Positionierung des Planetenzeigers
autoPlanet(RAZeiger);	
}
/* =================================================================================== */
/* 						aktuelles Sternbild für Sonne und Mond 						   */
function Sternbild()
{ 
var Sternbilder= new Array("Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische");
var stbld = (Math.floor(arguments[0].laenge*(180/Math.PI)/30))-1;
stbld = (stbld<0)?stbld=11:stbld;
arguments[0].Sternbild = Sternbilder[stbld];
}
/* =================================================================================== */
/* 						Klasse der Planeten											   */
function PLANET()
{
this.Periheldatum 		= arguments[0];
this.Inklination 		= arguments[1];
this.Knotenlaenge 		= arguments[2];
this.Perihel 			= arguments[3];
this.mittlereAnomalie 	= arguments[4];
this.Exzentrizitaet 	= arguments[5];
this.mittlereBewegung 	= arguments[6];
this.grosseHalbachse 	= arguments[7];
this.Name				= arguments[8];
Ephemeride(this);
}
/* =================================================================================== */
/* 						Auswahl und Aufruf der Konstruktoren						   */
function Planet()
{
/* Erde muss als Rechenwert immer initialisiert werden*/
Erde = new PLANET(47893,0,0,1.7936477,6.2330541,0.0167134,1.7202111e-2,1.0,"Erde");
akObjekt.wert = arguments[0];
	switch(arguments[0])
	{
	case(1):
	Merkur 	= new PLANET(47893,0.1222525,0.84147123,1.3491371,6.0300596,0.2056326,0.071424788,0.387099,"Merkur");
	break;
	case(2):
	Venus 	= new PLANET(47893,0.0592457,1.3367448,2.2938906,5.5471223,0.0067777,0.027962453,0.723332,"Venus");
	break;
	case(4):
	Mars 	= new PLANET(47893,0.0322837,0.8635947,5.8621241,4.6275694,0.0933958,9.146107e-3,1.523691,"Mars");
	break;
	case(5):
	Jupiter = new PLANET(46600.5,0.0228027,1.7549514,0.2698787,5.7230009,0.048091,1.45029e-3,5.202629,"Jupiter");
	break;
	case(6):
	Saturn 	= new PLANET(46600.5,0.0434238,1.9835651,1.6024533,2.6642521,0.052072,5.831913e-4,9.547464,"Saturn");
	break;
	case(7):
	Uranus 	= new PLANET(46600.5,0.0134931,1.2975635,3.0400461,1.414612,0.045874,2.03741e-4,19.246083,"Uranus");
	break;
	case(8):
	Neptun 	= new PLANET(46600.5,0.0309482,2.2999061,0.2371241,4.5683278,0.008449,1.036272e-4,30.205013,"Neptun");
	break;
	case(9):
	Pluto 	= new PLANET(46600.5,0.2990814,1.9237125,3.9179484,6.1934946,0.24884,6.939604e-5,39.460874,"Pluto");
	break;
	case(10):
			Luna();
	break;								
	default:
	break;
	}
}
/* =================================================================================== */
/*             Berechnung von Rektaszension und Deklination der Planeten 			   */
/* 			Aufruf als Klassenmethode in PLANETS() durch Ephemeride(this)  			   */
function Ephemeride(planet)
{
Julianisches_Datum();
var faktor1 = 0.40931976, faktor2 = 6.6711e-7, startwert = 0;
perihel = JULIANISCHESDATUM.wert - planet.Periheldatum;
planet.mittlereAnomalie = planet.mittlereAnomalie + planet.mittlereBewegung * perihel;
	while(Math.abs(planet.mittlereAnomalie) > Math.PI) 
	{
	planet.mittlereAnomalie = planet.mittlereAnomalie - 2 * Math.PI * Positiv(planet.mittlereAnomalie);
	}
var exzentrischeAnomalie = planet.mittlereAnomalie + planet.Exzentrizitaet * Math.sin(startwert);
	while(Math.abs(startwert - exzentrischeAnomalie) >  1e-7)
	{
	startwert = exzentrischeAnomalie;
	exzentrischeAnomalie = planet.mittlereAnomalie + planet.Exzentrizitaet * Math.sin(startwert);
	}
var radius0 = planet.grosseHalbachse * (1 - planet.Exzentrizitaet * Math.cos(exzentrischeAnomalie));
var wahreAnomalie = 2 * Math.atan(Math.sqrt((1 + planet.Exzentrizitaet) / (1 - planet.Exzentrizitaet)) * Math.tan(exzentrischeAnomalie / 2));
var omega = wahreAnomalie + planet.Perihel - planet.Knotenlaenge;
radius1 = radius0 * (Math.cos(planet.Knotenlaenge) * Math.cos(omega) - Math.sin(planet.Knotenlaenge) * Math.sin(omega) * Math.cos(planet.Inklination));
radius2 = radius0 * (Math.sin(planet.Knotenlaenge) * Math.cos(omega) + Math.cos(planet.Knotenlaenge) * Math.sin(omega) * Math.cos(planet.Inklination)); 
radius3 = radius0 * Math.sin(omega) * Math.sin(planet.Inklination);
	if(planet.grosseHalbachse == 1.0)
	{terra1 = radius1;terra2 = radius2;}
var Radius1 = radius1 - terra1;
var Radius2 = radius2 - terra2;
var Radius3 = radius3;
	if(Math.abs(Radius1) < 1e-8)
	{Radius1 = Positiv(Radius1) * 1e-8;}
var laenge = Math.atan(Radius2 / Radius1);
	if(Radius1 < 0)
	{laenge = laenge + Math.PI * Positiv(Radius2);}
var omega2 = Math.atan(Radius3 / Math.sqrt(Radius1 * Radius1 + Radius2 * Radius2));
laenge = laenge + faktor2 * perihel;
var sekunde = Math.cos(faktor1) * Math.sin(omega2) + Math.sin(faktor1) * Math.sin(laenge) * Math.cos(omega2);
var dkl = Math.atan(sekunde / Math.sqrt(1 - sekunde * sekunde));
var dkls = Math.cos(laenge) * Math.cos(omega2);
sekunde = Math.sin(laenge) * Math.cos(omega2) * Math.cos(faktor1) - Math.sin(omega2) * Math.sin(faktor1);
var rekt = Math.atan(sekunde / dkls);
	if(dkls < 0)
	{rekt = rekt + Math.PI * Positiv(sekunde);}
	if(rekt < 0)
	{rekt = rekt + 2 * Math.PI;}
var RA12 = rekt * 12 / Math.PI;
var DKL180 = Math.abs(dkl) * 180 / Math.PI;
var RAh = parseInt(RA12);
RA12 = 60 * (RA12 - RAh);
RAm = parseInt(RA12);
sekunde = parseInt(60 * (RA12 - RAm));
var DKL = parseInt(DKL180);
DKL180 = 60 * (DKL180 - DKL);
dkls = parseInt(DKL180);
startwert = parseInt(60 * (DKL180 - dkls));
DKL = DKL * Positiv(dkl);
var RAZeiger = RAh + "_" + RAm ;
//für die Anzeige im Fenster
//	RAh=(RAh<10)?"0"+RAh:RAh;
	RAm=(RAm<10)?"0"+RAm:RAm;
planet.Rektaszension = "Rektaszension: " + RAh + "h " + RAm +"m";
planet.Deklination = "Deklination: " + DKL + " Grad";
	if(planet.grosseHalbachse != 1.0)
	{
	//Übergabe-> Positionierung des Planetenzeigers
	autoPlanet(RAZeiger);	
	}
}
/* =================================================================================== */
/* 									Hilfsfunktion 									   */
function Positiv()
{
  var faktor = 1;
  if(arguments[0]<0) faktor = -1;
  return faktor;
}
/* =================================================================================== */
/* 				Berechnung des Julianischen Datums für 12 Uhr MEZ				       */
function Julianisches_Datum()
{
var schaltjahr;
	//Automatische Einstellung des Datums nach der PC-Uhr
	var PCZeit = new Date();
	var Tag = PCZeit.getDate();
	var Monat = PCZeit.getMonth()+1;
	var Jahr = PCZeit.getFullYear();
	var monate = new Array("Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember","Dezember");
	var manMonat = new Array();
		for(i=0;i<monate.length;i++)
		{manMonat[monate[i-1]] = i;}
	//manuelle Auswahl eines beliebigen Datums
	if(parseInt(document.getElementById("dskday").firstChild.nodeValue) != Tag || document.getElementById("dskmon").firstChild.nodeValue != monate[Monat-1])
	{
	Tag =  parseInt(document.getElementById("dskday").firstChild.nodeValue);
	Monat = manMonat[document.getElementById("dskmon").firstChild.nodeValue];
	}
var MonatTage = new Array(0,0,31,59,90,120,151,181,212,243,273,304,334);
var JulianischesDatum = (Jahr - 1994) * 365 + Tag;
	for(schaltjahr = 1993; schaltjahr < Jahr; schaltjahr++)
	{if((schaltjahr % 4) == 0){JulianischesDatum++;}}
	if(((Jahr % 4) == 0) && (Monat > 2)){JulianischesDatum++};
JulianischesDatum = JulianischesDatum + MonatTage[Monat] + 49353.5;
JULIANISCHESDATUM.wert = JulianischesDatum;
JULIANISCHESDATUM.JD = 2400000 + JulianischesDatum - 0.54167;
}
/* =================================================================================== */
//===========================================================================
//---------------------------- 17. Januar 2006 ------------------------------
//===========================================================================