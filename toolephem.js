/*
############################################################
###                    toolephem.js                      ###
###               von Michael Duetting                   ###
###                 copyright 2006                       ###

                für sternfreunde-muenster.de                     
      				(Ephemeriden-Rechner)

            CMS              |----||----|
            Datenbanken      |    ||    |
                             |----||----|
            eShops                 |----|
                        |------|   |    |
            Webdesign   |      |   |----|
                        | multi|p l i c o
            Multimedia  |------|


###                  Telemannstr. 26                     ###
###                   48147 M"+String.fromCharCode(252)+"nster                      ###
###             http://www.multiplico.de                 ###
###             USt-IdNr.: DE 233 806 458                ###
############################################################
*/
function changeSrc()
{
InitEph();
}
/* =================================================================================== */
/* Diese GLOBALEN Variablen werden in den Funktionen Planet und PLANETS zu Objekten    */
var SonneE,MondE,MerkurE, VenusE, MarsE, JupiterE, SaturnE, UranusE, NeptunE, PlutoE, ErdeE, terra1E, terra2E;
var sosys = new Array();
/* =================================================================================== */
//var akObjekt		= new Object();//speichert Planetenauswahl f"+String.fromCharCode(252)+"r automatische Zeigeraktualisierung
var SonneE			= new Object();//globales Objekt
var MondE			= new Object();//globales Objekt
JULIANISCHESDATUM_E	= new Object();//globales Objekt
altgrad 			= Math.PI / 180;//DEG
/* =================================================================================== */
/* 							Hilfsfunktionen 										   */
var ModifiziereE 	= function(m1,m2){return (m1 - Math.floor(m1 / m2) * m2);}
var Pi2E 			= function(x){x = ModifiziereE(x,2*Math.PI);return x;}
/* =================================================================================== */
/* 	      Umwandlung ekliptikaler in "+String.fromCharCode(228)+"quatoriale Koordinaten f"+String.fromCharCode(252)+"r Helios()			   */
function TransformKoordsE()
{
var Epoche 		= (arguments[1] - 2451545.0) / 36525;
var Ekliptik 	= (23+(26+21.45/60)/60 + Epoche * (-46.815 + Epoche * (-0.0006 + Epoche * 0.00181))/3600) * altgrad;
var cosEkliptik = Math.cos(Ekliptik);
var sinEkliptik = Math.sin(Ekliptik);
var sinLaenge	= Math.sin(arguments[0].laenge);
arguments[0].RA = Pi2E(Math.atan2((sinLaenge*cosEkliptik-Math.tan(arguments[0].breite)*sinEkliptik),Math.cos(arguments[0].laenge)));
arguments[0].DK = Math.asin(Math.sin(arguments[0].breite)*cosEkliptik+Math.cos(arguments[0].breite)*sinEkliptik*sinLaenge);
return arguments[0];
}
/* =================================================================================== */
/* 					Berechnet die Rektaszension der Sonne 							   */
function HeliosE()
{
var Datum 				= arguments[0] - 2447891.5;
var omega1 				= 279.403303 * altgrad;
var omega2 				= 282.768422 * altgrad;
PlanetE();
var AE 					= 149598500;
var mittlereSonne 		= 360*altgrad/365.242191*Datum+omega1-omega2;
var omega3				= mittlereSonne+360*altgrad/Math.PI*ErdeE.Exzentrizitaet*Math.sin(mittlereSonne);
SonneE.laenge			= Pi2E(omega3+omega2);
SonneE.breite			= 0;
SonneE.Anomalie 			= mittlereSonne;
SonneE 					= TransformKoordsE(SonneE,JULIANISCHESDATUM_E.JD);
SonneE.RAGrad			= SonneE.RA;
SonneE.RA 				= SonneE.RA * ((180/Math.PI)/15);
var raminute 			= (SonneE.RA - Math.floor(SonneE.RA))*60;
var RektaszensionStunde;
var RektaszensionMinute;
	if(SonneE.RA < 0)
	{RektaszensionStunde = Math.ceil(SonneE.RA);}
	else
	{RektaszensionStunde = Math.floor(SonneE.RA);}
	RektaszensionStunde  = (RektaszensionStunde<10)?"0"+RektaszensionStunde:RektaszensionStunde;
	if(raminute >= 59.5)
	{RektaszensionStunde++;raminute -= 60;}
RektaszensionMinute 	= Math.round(raminute);	
RektaszensionMinute		= (RektaszensionMinute<10)?"0"+RektaszensionMinute:RektaszensionMinute;
SonneE.Rektaszension	= RektaszensionStunde + "h " + RektaszensionMinute +"m";
var solDkl 				= SonneE.DK*(180/Math.PI);
var soldkls				= (solDkl - Math.floor(solDkl))*60;
var solDklString_0		= (solDkl>0)?"+":"-";
var solDklString_1		= (solDkl<0)?parseInt(solDkl)*-1:parseInt(solDkl);
var solDklString_2		= (solDklString_1<10 || solDklString_1 == 0)?"0"+solDklString_1:solDklString_1;
var solDklString_3		= solDklString_0 + solDklString_2 +String.fromCharCode(176)+" "
var soldklsString_1		= (soldkls<10 || soldkls == 0)?"0"+parseInt(soldkls):parseInt(soldkls);
SonneE.Deklination 		= solDklString_3 + soldklsString_1 +"'";
SonneE.Name = "Sonne";
//falls von LunaE aufgerufen, nicht ausf"+String.fromCharCode(252)+"hren
	if(!arguments[1])
	{
	SonneE.stb = SonneE.RA *15;//f"+String.fromCharCode(252)+"r SternbildPL
	SternbildPL(SonneE)
	sosys.push(SonneE);
	EphemTable(SonneE);
	}
}
/* =================================================================================== */
/* 				Berechnet Rektaszension, Deklination und Phase des Mondes  			   */
function LunaE()
{
(!arguments[0])?HeliosE(JULIANISCHESDATUM_E.JD):HeliosE(JULIANISCHESDATUM_E.JD,arguments[0]);
MondE.Perihel 		= 36.340410*altgrad;
MondE.Knoten		= 318.510107*altgrad;
MondE.Inklination	= 5.145396*altgrad;
MondE.Exzentrizitaet	= 0.054900;
var Datum 			= JULIANISCHESDATUM_E.JD-2447891.54;
var laenge 			= 318.351648*altgrad;
var Laenge			= 13.1763966*altgrad*Datum+laenge;
var anomalie		= Laenge-0.1114041*altgrad*Datum-MondE.Perihel;	
var absteigend		= MondE.Knoten-0.0529539*altgrad*Datum;
var lage			= Laenge-SonneE.laenge;
var variation		= 1.2739*altgrad*Math.sin(2*lage-anomalie);
var Anomalie		= 0.1858*altgrad*Math.sin(SonneE.Anomalie);
var Xanomalie		= 0.37*altgrad*Math.sin(SonneE.Anomalie);
MondE.Anomalie		= anomalie+variation-Anomalie-Xanomalie;
var zentrum			= 6.2886*altgrad*Math.sin(MondE.Anomalie);
var Yanomalie		= 0.214*altgrad*Math.sin(2*MondE.Anomalie);
var korrektur		= Laenge+variation+zentrum-Anomalie+Yanomalie;
var Variation		= 0.6583*altgrad*Math.sin(2*korrektur-SonneE.laenge);
var wahreLaenge		= korrektur+Variation;
var aufsteigend		= absteigend-0.16*altgrad*Math.sin(SonneE.Anomalie);
MondE.laenge		= Pi2E(aufsteigend+Math.atan2(Math.sin(wahreLaenge-aufsteigend)*Math.cos(MondE.Inklination),Math.cos(wahreLaenge-aufsteigend)));
MondE.breite		= Math.asin( Math.sin(wahreLaenge-aufsteigend)*Math.sin(MondE.Inklination));
MondE.Bahn			= wahreLaenge;
MondE				= TransformKoordsE(MondE,JULIANISCHESDATUM_E.JD);
MondE.RA			= MondE.RA * ((180/Math.PI)/15);
var raminute 		= (MondE.RA - Math.floor(MondE.RA))*60;
var RektaszensionStunde;
var RektaszensionMinute;
	if(MondE.RA < 0)
	{RektaszensionStunde 	= Math.ceil(MondE.RA);}
	else
	{RektaszensionStunde 	= Math.floor(MondE.RA);}
	RektaszensionStunde  	= (RektaszensionStunde<10)?"0"+RektaszensionStunde:RektaszensionStunde;
	if(raminute >= 59.5)
	{RektaszensionStunde++;raminute -= 60;}
RektaszensionMinute 		= Math.round(raminute);	
RektaszensionMinute			= (RektaszensionMinute<10)?"0"+RektaszensionMinute:RektaszensionMinute;
MondE.Rektaszension			= RektaszensionStunde + "h " + RektaszensionMinute +"m";
var lunDkl 				= Math.floor(MondE.DK*(180/Math.PI));
var lundkls				= (lunDkl - Math.floor(lunDkl))*60;
var lunDklString_0		= (lunDkl>0)?"+":"-";
var lunDklString_1		= (lunDkl<0)?parseInt(lunDkl)*-1:parseInt(lunDkl);
var lunDklString_2		= (lunDklString_1<10 || lunDklString_1 == 0)?"0"+lunDklString_1:lunDklString_1;
var lunDklString_3		= lunDklString_0 + lunDklString_2 +String.fromCharCode(176)+" ";
var lundklsString_1		= (lundkls<10 || lundkls == 0)?"0"+parseInt(lundkls):parseInt(lundkls);
MondE.Deklination 		= lunDklString_3 + lundklsString_1 +"'";
/*Mondphase*/
MondE.Alter = Pi2E(wahreLaenge-SonneE.laenge);
MondE.Phase = 0.5*(1-Math.cos(MondE.Alter));//1.0 = Vollmond
var Phase = 1/29.53*360*altgrad;
var phase = ModifiziereE(MondE.Alter,90*altgrad);
	if(phase < Phase || phase > 90*altgrad-Phase)
	{phase = 2*Math.round(MondE.Alter/(90*altgrad));}
	else
	{phase = 2*Math.floor(MondE.Alter/(90*altgrad))+1;}
MondE.stb = MondE.RA *15;//f"+String.fromCharCode(252)+"r SternbildPL
SternbildPL(MondE)	
//akObjekt.wert = 10;
MondE.Name = "Mond";
sosys.push(MondE);
EphemTable(MondE)
//Übergabe-> Positionierung des Planetenzeigers
//autoPlanet(RAZeiger);	
}
/* =================================================================================== */
/* 						aktuelles Sternbild f"+String.fromCharCode(252)+"r Sonne und Mond 						   */
function SternbildE()
{ 
var Sternbilder= new Array("Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc");
var stbld = (Math.floor(arguments[0].laenge*(180/Math.PI)/30))-1;
stbld = (stbld<0)?stbld=11:stbld;
arguments[0].Sternbild = Sternbilder[stbld];
}
/* =================================================================================== */
/* =================================================================================== */
/* 						aktuelles Sternbild f"+String.fromCharCode(252)+"r Planeten 						       */
function SternbildPL()
{
var aqr = ["Wassermann",330,352]; var psc = ["Fische",353,27]; var ari = ["Widder",28,51]; var tau = ["Stier",52,90];
var gem = ["Zwillinge",91,120]; var  cnc = ["Krebs",121,138]; var leo = ["L"+String.fromCharCode(246)+"we",139,175]; var vir = ["Jungfrau",176,215];
var lib = ["Waage",216,238]; var sco = ["Skorpion",239,246]; var oph = ["Schlangentr"+String.fromCharCode(228)+"ger",247,266];
var sgr = ["Sch"+String.fromCharCode(252)+"tze",267,302]; var cap =["Steinbock",303,329];
var constel = [aqr,psc,ari,tau,gem,cnc,leo,vir,lib,sco,oph,sgr,cap];
arguments[0].Sternbild = psc[0];
	for(var i=0;i<constel.length;i++)
	{
		if(parseInt(arguments[0].stb) >= constel[i][1] && parseInt(arguments[0].stb) <= constel[i][2])
		{
			arguments[0].Sternbild = constel[i][0];
		}	
	}	
}
/* =================================================================================== */
/* 						Klasse der Planeten											   */
function PLANET_E()
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
EphemerideE(this);
}
/* =================================================================================== */
/* 						Auswahl und Aufruf der Konstruktoren						   */
function PlanetE()
{
/* Erde muss als Rechenwert immer initialisiert werden*/
ErdeE = new PLANET_E(47893,0,0,1.7936477,6.2330541,0.0167134,1.7202111e-2,1.0,"Erde");
//akObjekt.wert = arguments[0];
	switch(arguments[0])
	{
	case(1):
	MerkurE 	= new PLANET_E(47892.2,0.1222525,0.84147123,1.3491371,6.0300596,0.2056326,0.071424788,0.387099,"Merkur");
	break;
	case(2):
	VenusE 	= new PLANET_E(47893,0.0592457,1.3367448,2.2938906,5.5471223,0.0067777,0.027962453,0.723332,"Venus");
	break;
	case(3):
	MarsE 	= new PLANET_E(47892.7,0.0322837,0.8635947,5.8621241,4.6275694,0.0933958,9.146107e-3,1.523691,"Mars");
	break;
	case(4):
	JupiterE = new PLANET_E(46605.0,0.0228027,1.7549514,0.2698787,5.7230009,0.048091,1.45029e-3,5.202629,"Jupiter");
	break;
	case(5):
	SaturnE 	= new PLANET_E(46589.0,0.0434238,1.9835651,1.6024533,2.6642521,0.052072,5.831913e-4,9.547464,"Saturn");
	break;
	case(6):
	UranusE 	= new PLANET_E(46600.5,0.0134931,1.2975635,3.0400461,1.414612,0.045874,2.03741e-4,19.246083,"Uranus");
	break;
	case(7):
	NeptunE 	= new PLANET_E(46630.0,0.0309482,2.2999061,0.2371241,4.5683278,0.008449,1.036272e-4,30.205013,"Neptun");
	break;
	case(8):
	PlutoE 	= new PLANET_E(46600.5,0.2990814,1.9237125,3.9179484,6.1934946,0.24884,6.939604e-5,39.460874,"Pluto");
	break;
	case(9):
	LunaE();
	break;								
	default:
	break;
	}
}
/* =================================================================================== */
/*             Berechnung von Rektaszension und Deklination der Planeten 			   */
/* 			Aufruf als Klassenmethode in PLANETS() durch Ephemeride(this)  			   */
function EphemerideE(planet)
{
(uStart==0)?JulianischesDatum():void(0);
var faktor1 = 0.40931976, faktor2 = 6.6711e-7, startwert = 0;
perihel = JULIANISCHESDATUM_E.wert - planet.Periheldatum;
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
//f"+String.fromCharCode(252)+"r die Anzeige im Fenster
	RAh=(RAh<10)?"0"+RAh:RAh;
	RAm=(RAm<10)?"0"+RAm:RAm;
planet.Rektaszension = RAh + "h " + RAm +"m";
var DklString_0		= (DKL>0)?"+":"-";
var DklString_1		= (DKL<0)?parseInt(DKL)*-1:parseInt(DKL);
var DklString_2		= (DklString_1<10 || DklString_1 == 0)?"0"+DklString_1:DklString_1;
var DklString_3		= DklString_0 + DklString_2 +String.fromCharCode(176)+" ";
var dklsString_1 	= (dkls<10 || dkls == 0)?"0"+dkls:dkls;
planet.Deklination  =  DklString_3 + dklsString_1 + "'";
	if(planet.grosseHalbachse != 1.0)
	{
	planet.stb = (rekt * 12 / Math.PI)*15;//f"+String.fromCharCode(252)+"r SternbildPL
	SternbildPL(planet)
	//Übergabe-> Positionierung des Planetenzeigers
	sosys.push(planet);
	EphemTable(planet);	
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
/* 				Berechnung des Julianischen Datums f"+String.fromCharCode(252)+"r 12 Uhr MEZ				       */
var monate = new Array("Januar","Februar","M"+String.fromCharCode(228)+"rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember","Dezember");
var monatLang = [31,28,31,30,31,30,31,31,30,31,30,31];
function JulianischesDatum()
{
var schaltjahr;
	//Automatische Einstellung des Datums nach der PC-Uhr
	var PCZeit = new Date();
	var Tag = PCZeit.getDate();
	var Monat = PCZeit.getMonth()+1;
	var Jahr = PCZeit.getFullYear();
	var manMonat = new Array();
		for(i=0;i<monate.length;i++)
		{manMonat[monate[i-1]] = i;}			
	//manuelle Auswahl eines beliebigen Datums
	if(arguments[0])
	{
	Jahr 	= arguments[2];
	Tag 	= arguments[0];
		if(arguments[1] >= 12)
		{
		Monat = 1;
		Jahr += 1;
		}
		else
		{Monat 	= arguments[1]+1;}
	}		
var MonatTage = new Array(0,0,31,59,90,120,151,181,212,243,273,304,334);
var JulianischesDatum = (Jahr - 1994) * 365 + Tag;
	for(schaltjahr = 1993; schaltjahr < Jahr; schaltjahr++)
	{if((schaltjahr % 4) == 0){JulianischesDatum++;}}
	if(((Jahr % 4) == 0) && (Monat > 2)){JulianischesDatum++};
JulianischesDatum = JulianischesDatum + MonatTage[Monat] + 49353.5;
JULIANISCHESDATUM_E.wert = JulianischesDatum;
JULIANISCHESDATUM_E.JD = 2400000 + JulianischesDatum - 0.54167;
JULIANISCHESDATUM_E.normal = Tag +". " + monate[Monat-1] + " " + Jahr;
}
//================================================================================
function JDReverse()
{
//2440587.45833 1.1.1970 00:00:00
var jdtest = (JULIANISCHESDATUM_E.JD - 2440587.45833)*86400*1000;
var JDZeit = new Date(jdtest);
var JDJahr = JDZeit.getFullYear();
var JDMonat = JDZeit.getMonth();
var JDTag = JDZeit.getDate();
var JDStd = JDZeit.getHours();
var JDMin = JDZeit.getMinutes();
JULIANISCHESDATUM_E.normal = JDTag +". "+ monate[JDMonat] +" "+ JDJahr;
}
//================================================================================
//Ausgabe
var DBData = [];
function EphemTable()
{
var data = "data=";
	if(uStart == 1)
	{

		with(arguments[0])
		{
		document.getElementById("ephUser").style.margin = "0px 0px 0px 65px";
			if(alleObjekte == 0)
			{
				
				data += Name+"_";
			var td0 = document.createElement("td");
				td0.className = "micro3";
				var ephNormDat = document.createTextNode(JULIANISCHESDATUM_E.normal);
				td0.appendChild(ephNormDat);
				document.getElementById("ephUserbody").lastChild.appendChild(td0);
				data += JULIANISCHESDATUM_E.normal+"_";
			}		
		var td1 = document.createElement("td");
			td1.className = "micro3a";
				if(alleObjekte == 0)
				{
				var ephJD = document.createTextNode(Math.ceil(JULIANISCHESDATUM_E.JD));
				data += Math.ceil(JULIANISCHESDATUM_E.JD)+"_";
				}
				else
				{
				var ephJD = document.createTextNode(Name);
				data += Name+"_";
				}
			td1.appendChild(ephJD);		
			document.getElementById("ephUserbody").lastChild.appendChild(td1);			
		var td2 = document.createElement("td");
			td2.className = "micro3";
			var ephRA = document.createTextNode(Rektaszension);
			data += Rektaszension+"_";
			td2.appendChild(ephRA);
			document.getElementById("ephUserbody").lastChild.appendChild(td2);				
		var td3 = document.createElement("td");
			td3.className = "micro3";
			var ephDK = document.createTextNode(Deklination);
			data += Deklination+"_";
			td3.appendChild(ephDK);
			document.getElementById("ephUserbody").lastChild.appendChild(td3);
		var td4 = document.createElement("td");
			td4.className = "micro3a";
			var ephCon = document.createTextNode(Sternbild);
			data += Sternbild;
			td4.appendChild(ephCon);
			document.getElementById("ephUserbody").lastChild.appendChild(td4);
				if(Name == "Mond")
				{
				//Beleuchtung des Mondes in %: Mond.Phase*100
				var prozPhase = Phase*100;
				var prozPhaseStr = prozPhase.toString();
				var prozAnzStr = prozPhaseStr.substring(0,4);				
				var td5 = document.createElement("td");
					td5.className = "micro3a";
					var phasTxt = document.createTextNode(prozAnzStr+"%");
					data += "_"+prozAnzStr+"%";
					td5.appendChild(phasTxt);
					document.getElementById("ephUserbody").lastChild.appendChild(td5);
				var mophas = parseInt(prozPhase);
				}
				else{
				var mophas = -1;	
				}

		//Objektaufruf für den Atlas
		var atlasPos = AtlasPos(Rektaszension,Deklination);
		td1.setAttribute("onclick","goAtlasPosition('"+atlasPos+Name+"',"+mophas+")");						
		}

	}
		if(alleObjekte!=0 && DBData.length ==8)
		{data += "_"+JULIANISCHESDATUM_E.normal}			
	DBData.push(data);
}
/* ========================================================================== */
function AtlasPos(Rektaszension,Deklination){
	var rah = parseInt(Rektaszension.split(" ")[0]);
	var ram = parseInt(Rektaszension.split(" ")[1]);
	var dkg = parseInt(Deklination.split(" ")[0]);
	var dkm = parseInt(Deklination.split(" ")[1]);
	return rah+"*"+ram+"*0*"+dkg+"*"+dkm+"*0*";
	}
/* ========================================================================== */
function goAtlasPosition(data,mphas){
	var zuab = (SonneE.laenge < MondE.laenge)?1:-1;
	/*Bestimmung des Phasenbildes*/
	//9*24*0*19*0*0*Mond*0
		if(mphas != -1){
		var phasePic = (mphas < 1)?"0":"15";
			phasePic = (mphas > 90)?"15":phasePic;
			phasePic = (mphas < 10 && mphas > 1 && zuab == 1)?"4":phasePic;
			phasePic = (mphas < 10 && mphas > 1 && zuab == -1)?"24":phasePic;
			phasePic = (mphas < 60 && mphas > 10 && zuab == 1)?"8":phasePic;
			phasePic = (mphas < 60 && mphas > 10 && zuab == -1)?"22":phasePic;
		data += "*"+phasePic;	
		}
var win = window.open("atlas.php?"+data);	
	console.log(data);
}
/* ========================================================================== */
function InitEph()
{
//Init der Objekte--------------
var i = 1;
	while(i!=9)
	{
	PlanetE(i)
	i++;
	}
//HeliosE(JULIANISCHESDATUM_E.JD);
LunaE();
//------------------------------
/*Aufbau Interface*/
var CZeit = new Date();
var CMonat = CZeit.getMonth();
	for(i=0;i<sosys.length;i++)
	{
	var opt 	= document.createElement("option");
	opt.value 	= i;
	var optTxt 	= document.createTextNode(sosys[i].Name);
//		if(i == 1)
//		{opt.setAttribute("selected","selected");}
	opt.appendChild(optTxt);
	document.getElementById("ephObjekt").appendChild(opt);
	}
/*	
var optAlle 	= document.createElement("option");
optAlle.value 	= 10;
var optAlleTxt 	= document.createTextNode("alle");
optAlle.appendChild(optAlleTxt);	
document.getElementById("ephObjekt").appendChild(optAlle);	
*/
	for(i=0;i<monate.length-1;i++)
	{
	var opt 	= document.createElement("option");
	opt.value 	= i;
	var optTxt 	= document.createTextNode(monate[i]);
		if(i == CMonat)
		{opt.setAttribute("selected","selected");}
	opt.appendChild(optTxt);
	document.getElementById("ephMonat").appendChild(opt);
	}	
}
/* ========================================================================== */
var uStart = 0;
function userStart()
{
uStart = 1;
DBData.length = 0;
alleObjekte = (parseInt(document.getElementById("ephObjekt").value)==10)?1:0;
//Ausgabebereich erstellen
if(document.getElementById("ephemUserAusgabe"))
{document.getElementById("ephemUserAusgabe").parentNode.removeChild(document.getElementById("ephemUserAusgabe"));}
var ephemUserAusgabe 	= document.createElement("div");
ephemUserAusgabe.id 	="ephemUserAusgabe";
var ephUser 			= document.createElement("table");
ephUser.id ="ephUser";
	if(alleObjekte == 1)
	{
	var cgroup = document.createElement("colgroup");
	var col_0 = document.createElement("col");
	var col_0a = document.createAttribute("width");
	col_0a.nodeValue = "100";
	col_0.setAttributeNode(col_0a);
	cgroup.appendChild(col_0);
	ephUser.appendChild(cgroup);
	}
var ephUserObj			= document.createElement("caption");
ephUserObj.className 	= "blue9p";
ephUserObj.id			= "ephUserObj";
var objTxt				= (document.getElementById("ephObjekt").value!=10)?document.createTextNode(sosys[document.getElementById("ephObjekt").value].Name):document.createTextNode("Daten f"+String.fromCharCode(252)+"r den "+JULIANISCHESDATUM_E.normal);
ephUserObj.appendChild(objTxt);
//print
var prAn				= document.createElement("a");
prAn.className 			= "nadel";
prAn.style.marginLeft	= "20px";
prAn.href 				= "javascript:EphPrint()";
prAn.title 				= "Druckversion";
prAnImg 				= document.createElement("img");
prAnImg.src				= "icon2010/print.gif";
prAnImg.alt				= "Druckversion";
prAn.appendChild(prAnImg);
/*	if(/MSIE/.test(navigator.userAgent)==false)
	{ephUserObj.appendChild(prAn);}*/
ephUserObj.appendChild(prAn);	
//------
var ephUserHead			= document.createElement("thead");
var trEuH				= document.createElement("tr");
var uhead 	 			= ["Datum","Jul. Dat.","Rekt.","Dekl.","Sternbild","Phase"];
uhead[1]				= (alleObjekte==1)?"Objekt":uhead[1];
var uheadlen			= (parseInt(document.getElementById("ephObjekt").value)==9 || alleObjekte==1)?uhead.length:uhead.length-1;
	for(i=alleObjekte;i<uheadlen;i++)
	{
	var tdEuH			= document.createElement("td");
	tdEuH.className 	= "bautor";
	var tdEuHtxt		= document.createTextNode(uhead[i]);
	tdEuH.appendChild(tdEuHtxt);
	trEuH.appendChild(tdEuH);	
	}	
ephUserHead.appendChild(trEuH);
ephUser.appendChild(ephUserHead);
var ephUserbody			= document.createElement("tbody");
ephUserbody.id			= "ephUserbody";
ephUser.appendChild(ephUserObj);
ephUser.appendChild(ephUserbody);
ephemUserAusgabe.appendChild(ephUser);
document.getElementById("inhalt").appendChild(ephemUserAusgabe);
//sonne =8, mond=9
	switch(parseInt(document.getElementById("ephObjekt").value))
	{
	case(8):var auswahlObjekt=100;break;
	case(9):var auswahlObjekt=99;break;
	case(10):var auswahlObjekt=101;break;
	default:
	var auswahlObjekt = parseInt(document.getElementById("ephObjekt").value)+1;
	break;
	}
Berechnung(auswahlObjekt);	
//document.getElementById("inhalt").appendChild(xtools);
}
/* ========================================================================== */
var trEphemId = new String();
var alleObjekte = 0;
function Berechnung()
{
var Tag 	= parseInt(document.getElementById("ephTag").value);
var Monat 	= parseInt(document.getElementById("ephMonat").value);	
Tag 		= (Tag > monatLang[Monat])?monatLang[Monat]:Tag; 
var Jahr	= parseInt(document.getElementById("ephJahr").value);
var schritt = parseInt(document.getElementById("ephStep").value);
JulianischesDatum(Tag,Monat,Jahr);
	if(arguments[0] != 101)
	{
	alleObjekte = 0;
		for(k=0;k<parseInt(document.getElementById("ephAnzahl").value);k++)
		{
			switch(arguments[0])
			{
			case(100):
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);		
			HeliosE(JULIANISCHESDATUM_E.JD);
			break;
			case(99):
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);		
			LunaE(true);
			break;
			default:
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);
			PlanetE(arguments[0]);
			break;
			}
		JULIANISCHESDATUM_E.JD += parseInt(document.getElementById("ephStep").value);
		JULIANISCHESDATUM_E.wert += parseInt(document.getElementById("ephStep").value);
		JDReverse();
		}
	}
	else
	{
	document.getElementById("ephAnzahl").options[0].selected = "selected";
	document.getElementById("ephStep").options[0].selected = "selected";
	schritt = 1;
	alleObjekte = 1;
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);		
			HeliosE(JULIANISCHESDATUM_E.JD);
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);		
			LunaE(true);
			for(var i=1;i<=7;i++)
			{
			var tr = document.createElement("tr");
			document.getElementById("ephUserbody").appendChild(tr);			
			PlanetE(i);
			}				
	}	
}
/* ========================================================================== */
var ephemNode;
function EphPrint()
{
ephemNode = document.getElementById("ephemUserAusgabe").cloneNode(true);
var win = window.open("templates2010/ephemPrint.html","ephem");
win.focus();
}
//===========================================================================
//===========================================================================
//----------------------------- 21.06.2010 ------- 475/76/502/522------------
//----------------------------- 13.08.2019 ----------------------------------
//----------------------------- 21.08.2020 ------Mondphasen im Atlas---------
//===========================================================================