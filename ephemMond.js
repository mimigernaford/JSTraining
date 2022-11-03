/*
############################################################
###                   ephemMond.js                       ###
###               von Michael Duetting                   ###
###                   copyright 2017                     ###
                für sternfreunde-muenster.de                     
      			  (Quartals-Ephemeriden)
###                  Telemannstr. 26                     ###
###                   48147 Münster                      ###
###             http://www.telescopium.de                ###
############################################################
*/
var EPH = {
	Init			:function()
					{
					//document.getElementById("ephem").action = "javascript:EPH.TypeOfStart()";
					EPH.extend(DUETT);	
					//	while(document.getElementById("jahr").hasChildNodes(true))
					//	{EPH.rEle(document.getElementById("jahr").firstChild);}					
					EPH.JulianischesDatum();
					/*
					[EPH.JULIANISCHESDATUM_E.jahr-1,EPH.JULIANISCHESDATUM_E.jahr,EPH.JULIANISCHESDATUM_E.jahr+1].forEach(function(jahr){
						var o 		= document.createElement("option");					
						var oTxt	= document.createTextNode(jahr);						
						o.value		= jahr;
						o.appendChild(oTxt);
						o.selected = (jahr == new Date().getFullYear())?true:false;
						document.getElementById("jahr").appendChild(o);											
						})
					*/
					//Init der Objekte--------------
					var i = 1;
						while(i!=9)
						{
						EPH.PlanetE(i);
						i++;
						}
					EPH.HeliosE(EPH.JULIANISCHESDATUM_E.JD);
					EPH.LunaE();					
					},
	//Eigenschaften und Methoden werden in den Funktionen Planet und PLANETS zugewiesen	
	SonneE			:{},
	MondE			:{},	
	MerkurE			:{},
	VenusE			:{},
	MarsE			:{},
	JupiterE		:{},
	SaturnE			:{},
	UranusE			:{},
	NeptunE			:{},
	PlutoE			:{},	
	Objekte			:[null],
	sosys			:[],
	JULIANISCHESDATUM_E:{},
	Quartale		:[0,3,6,9],
	OUTPUT			:[],
	uStart			:0,
	/* =================================================================================== */
	/* 				Berechnung des Julianischen Datums für 12 Uhr MEZ				       */
	monate  		:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember","Dezember"],
	monatLang 		:[31,28,31,30,31,30,31,31,30,31,30,31],
	wotags			:["So","Mo","Di","Mi","Do","Fr","Sa"],
	JulianischesDatum:function()
	{
	var schaltjahr;
		//Automatische Einstellung des Datums nach der PC-Uhr
		var PCZeit 		= new Date();
		var Tag 		= PCZeit.getDate();
		var Monat 		= PCZeit.getMonth()+1;
		var Jahr 		= PCZeit.getFullYear();
		var manMonat 	= new Array();
			for(i=0;i<EPH.monate.length;i++)
			{manMonat[EPH.monate[i-1]] = i;}			
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
	var MonatTage 					= new Array(0,0,31,59,90,120,151,181,212,243,273,304,334);
	var JulianischesDatum 			= (Jahr - 1994) * 365 + Tag;
		for(schaltjahr = 1993; schaltjahr < Jahr; schaltjahr++)
		{if((schaltjahr % 4) == 0){JulianischesDatum++;}}
		if(((Jahr % 4) == 0) && (Monat > 2)){JulianischesDatum++};
	JulianischesDatum 				= JulianischesDatum + MonatTage[Monat] + 49353.5;
	EPH.JULIANISCHESDATUM_E.wert 	= JulianischesDatum;
	EPH.JULIANISCHESDATUM_E.JD	 	= 2400000 + JulianischesDatum - 0.54167;
	EPH.JULIANISCHESDATUM_E.normal 	= Tag +". " + EPH.monate[Monat-1] + " " + Jahr;
	EPH.JULIANISCHESDATUM_E.jahr	= Jahr;	
	EPH.JULIANISCHESDATUM_E.monat	= Monat;
	EPH.JULIANISCHESDATUM_E.monatLang = EPH.monatLang[Monat-1];
	EPH.JULIANISCHESDATUM_E.Tag		= Tag;
	//Wochentag
	var TagDerWoche					= new Date(Jahr,Monat-1,Tag);
	EPH.JULIANISCHESDATUM_E.wotag	= EPH.wotags[TagDerWoche.getDay()];
	},	
	//================================================================================
	JDReverse:function ()
	{
	//2440587.45833 1.1.1970 00:00:00
	var jdtest = (EPH.JULIANISCHESDATUM_E.JD - 2440587.45833)*86400*1000;
	var JDZeit = new Date(jdtest);
	var JDJahr = JDZeit.getFullYear();
	var JDMonat = JDZeit.getMonth();
	var MonatKurz = JDMonat +1;
	var JDTag = JDZeit.getDate();
	var JDStd = JDZeit.getHours();
	var JDMin = JDZeit.getMinutes();
	EPH.JULIANISCHESDATUM_E.normal = JDTag +". "+ EPH.monate[JDMonat] +" "+ JDJahr;	
	EPH.JULIANISCHESDATUM_E.kurz = JDTag +"."+ MonatKurz +".";
	EPH.JULIANISCHESDATUM_E.JDTag = JDTag;
	EPH.JULIANISCHESDATUM_E.JDMonat = JDMonat;
	EPH.JULIANISCHESDATUM_E.JDJahr = JDJahr;
	},	
	/* =================================================================================== */
	/* 							Hilfsfunktionen 										   */
	altgrad			:Math.PI /180,//DEG
	ModifiziereE 	:function(m1,m2){return (m1 - Math.floor(m1 / m2) * m2);},
	Pi2E 			:function(x){x = EPH.ModifiziereE(x,2*Math.PI);return x;},
	Positiv			:function ()
					{
					var faktor = (arguments[0]<0)?-1:1;
					return faktor;
					},
	/* =================================================================================== */
	/* 	      Umwandlung ekliptikaler in äquatoriale Koordinaten für Helios()			   */
	TransformKoordsE:function()
	{
	var Epoche 		= (arguments[1] - 2451545.0) / 36525;
	var Ekliptik 	= (23+(26+21.45/60)/60 + Epoche * (-46.815 + Epoche * (-0.0006 + Epoche * 0.00181))/3600) *  EPH.altgrad;
	var cosEkliptik = Math.cos(Ekliptik);
	var sinEkliptik = Math.sin(Ekliptik);
	var sinLaenge	= Math.sin(arguments[0].laenge);
	arguments[0].RA = EPH.Pi2E(Math.atan2((sinLaenge*cosEkliptik-Math.tan(arguments[0].breite)*sinEkliptik),Math.cos(arguments[0].laenge)));
	arguments[0].DK = Math.asin(Math.sin(arguments[0].breite)*cosEkliptik+Math.cos(arguments[0].breite)*sinEkliptik*sinLaenge);
	return arguments[0];
	},
	/* =================================================================================== */
	/* 					Berechnet die Rektaszension der Sonne 							   */
	HeliosE			:function()
	{
	var Datum 				= arguments[0] - 2447891.5;
	var omega1 				= 279.403303 * EPH.altgrad;
	var omega2 				= 282.768422 * EPH.altgrad;
	EPH.PlanetE();
	var AE 					= 149598500;
	var mittlereSonne 		= 360*EPH.altgrad/365.242191*Datum+omega1-omega2;
	var omega3				= mittlereSonne+360*EPH.altgrad/Math.PI*EPH.ErdeE.Exzentrizitaet*Math.sin(mittlereSonne);
	EPH.SonneE.laenge		= EPH.Pi2E(omega3+omega2);
	EPH.SonneE.breite		= 0;
	EPH.SonneE.Anomalie 	= mittlereSonne;
	EPH.SonneE 				= EPH.TransformKoordsE(EPH.SonneE,EPH.JULIANISCHESDATUM_E.JD);
	EPH.SonneE.RAGrad		= EPH.SonneE.RA;
	EPH.SonneE.RA 			= EPH.SonneE.RA * ((180/Math.PI)/15);
	var raminute 			= (EPH.SonneE.RA - Math.floor(EPH.SonneE.RA))*60;
	var RektaszensionStunde;
	var RektaszensionMinute;
		if(EPH.SonneE.RA < 0)
		{RektaszensionStunde = Math.ceil(EPH.SonneE.RA);}
		else
		{RektaszensionStunde = Math.floor(EPH.SonneE.RA);}
		RektaszensionStunde  = (RektaszensionStunde<10)?"0"+RektaszensionStunde:RektaszensionStunde;
		if(raminute >= 59.5)
		{RektaszensionStunde++;raminute -= 60;}
	RektaszensionMinute 	= Math.round(raminute);	
	RektaszensionMinute		= (RektaszensionMinute<10)?"0"+RektaszensionMinute:RektaszensionMinute;
	EPH.SonneE.Rektaszension	= RektaszensionStunde + "h " + RektaszensionMinute +"m";
	var solDkl 				= EPH.SonneE.DK*(180/Math.PI);
	var soldkls				= (solDkl - Math.floor(solDkl))*60;
	var solDklString_0		= (solDkl>0)?"+":"-";
	var solDklString_1		= (solDkl<0)?parseInt(solDkl)*-1:parseInt(solDkl);
	var solDklString_2		= (solDklString_1<10 || solDklString_1 == 0)?"0"+solDklString_1:solDklString_1;
	var solDklString_3		= solDklString_0 + solDklString_2 + "° "
	var soldklsString_1		= (soldkls<10 || soldkls == 0)?"0"+parseInt(soldkls):parseInt(soldkls);
	EPH.SonneE.Deklination 	= solDklString_3 + soldklsString_1 +"'";
	EPH.SonneE.Name 		= "Sonne";
	//falls von LunaE aufgerufen, nicht ausführen
		if(!arguments[1])
		{
		EPH.SonneE.stb = EPH.SonneE.RA *15;//für SternbildPL
		EPH.SternbildPL(EPH.SonneE)
		EPH.sosys.push(EPH.SonneE);		
		}
	},
	/* =================================================================================== */
	/* 				Berechnet Rektaszension, Deklination und Phase des Mondes  			   */
	LunaE			:function()
	{
	(!arguments[0])?EPH.HeliosE(EPH.JULIANISCHESDATUM_E.JD):EPH.HeliosE(EPH.JULIANISCHESDATUM_E.JD,arguments[0]);
	EPH.MondE.schritt			= 1;
	EPH.MondE.anzahl			= EPH.JULIANISCHESDATUM_E.monatLang;
	EPH.MondE.Perihel 			= 36.340410	*EPH.altgrad;
	EPH.MondE.Knoten			= 318.510107*EPH.altgrad;
	EPH.MondE.Inklination		= 5.145396	*EPH.altgrad;
	EPH.MondE.Exzentrizitaet	= 0.054900;
	var Datum 			= EPH.JULIANISCHESDATUM_E.JD-2447891.54;
	var laenge 			= 318.351648*EPH.altgrad;
	var Laenge			= 13.1763966*EPH.altgrad*Datum+laenge;
	var anomalie		= Laenge-0.1114041*EPH.altgrad*Datum-EPH.MondE.Perihel;	
	var absteigend		= EPH.MondE.Knoten-0.0529539*EPH.altgrad*Datum;
	var lage			= Laenge-EPH.SonneE.laenge;
	var variation		= 1.2739*EPH.altgrad*Math.sin(2*lage-anomalie);
	var Anomalie		= 0.1858*EPH.altgrad*Math.sin(EPH.SonneE.Anomalie);
	var Xanomalie		= 0.37*EPH.altgrad*Math.sin(EPH.SonneE.Anomalie);
	EPH.MondE.Anomalie	= anomalie+variation-Anomalie-Xanomalie;
	var zentrum			= 6.2886*EPH.altgrad*Math.sin(EPH.MondE.Anomalie);
	var Yanomalie		= 0.214*EPH.altgrad*Math.sin(2*EPH.MondE.Anomalie);
	var korrektur		= Laenge+variation+zentrum-Anomalie+Yanomalie;
	var Variation		= 0.6583*EPH.altgrad*Math.sin(2*korrektur-EPH.SonneE.laenge);
	var wahreLaenge		= korrektur+Variation;
	var aufsteigend		= absteigend-0.16*EPH.altgrad*Math.sin(EPH.SonneE.Anomalie);
	EPH.MondE.laenge	= EPH.Pi2E(aufsteigend+Math.atan2(Math.sin(wahreLaenge-aufsteigend)*Math.cos(EPH.MondE.Inklination),Math.cos(wahreLaenge-aufsteigend)));
	EPH.MondE.breite	= Math.asin( Math.sin(wahreLaenge-aufsteigend)*Math.sin(EPH.MondE.Inklination));
	EPH.MondE.Bahn		= wahreLaenge;
	EPH.MondE			= EPH.TransformKoordsE(EPH.MondE,EPH.JULIANISCHESDATUM_E.JD);
	EPH.MondE.RA		= EPH.MondE.RA * ((180/Math.PI)/15);
	var raminute 		= (EPH.MondE.RA - Math.floor(EPH.MondE.RA))*60;
	var RektaszensionStunde;
	var RektaszensionMinute;
		if(EPH.MondE.RA < 0)
		{RektaszensionStunde 	= Math.ceil(EPH.MondE.RA);}
		else
		{RektaszensionStunde 	= Math.floor(EPH.MondE.RA);}
		RektaszensionStunde 	= (RektaszensionStunde<10)?"0"+RektaszensionStunde:RektaszensionStunde;
		if(raminute >= 59.5)
		{RektaszensionStunde++;raminute -= 60;}
	RektaszensionMinute 	= Math.round(raminute);	
	RektaszensionMinute		= (RektaszensionMinute<10)?"0"+RektaszensionMinute:RektaszensionMinute;
	EPH.MondE.Rektaszension	= RektaszensionStunde + "h " + RektaszensionMinute +"m";
	var lunDkl 				= Math.floor(EPH.MondE.DK*(180/Math.PI));
	var lundkls				= (lunDkl - Math.floor(lunDkl))*60;
	var lunDklString_0		= (lunDkl>0)?"+":"-";
	var lunDklString_1		= (lunDkl<0)?parseInt(lunDkl)*-1:parseInt(lunDkl);
	var lunDklString_2		= (lunDklString_1<10 || lunDklString_1 == 0)?"0"+lunDklString_1:lunDklString_1;
	var lunDklString_3		= lunDklString_0 + lunDklString_2 + "° ";
	var lundklsString_1		= (lundkls<10 || lundkls == 0)?"0"+parseInt(lundkls):parseInt(lundkls);
	EPH.MondE.Deklination 	= lunDklString_3;// + lundklsString_1 +"'";
	/*Mondphase*/
	EPH.MondE.Alter = EPH.Pi2E(wahreLaenge-EPH.SonneE.laenge);
	EPH.MondE.Phase = 0.5*(1-Math.cos(EPH.MondE.Alter));//1.0 = Vollmond
	var Phase = 1/29.53*360*EPH.altgrad;
	var phase = EPH.ModifiziereE(EPH.MondE.Alter,90*EPH.altgrad);
		if(phase < Phase || phase > 90*EPH.altgrad-Phase)
		{phase = 2*Math.round(EPH.MondE.Alter/(90*EPH.altgrad));}
		else
		{phase = 2*Math.floor(EPH.MondE.Alter/(90*EPH.altgrad))+1;}
	EPH.MondE.stb = EPH.MondE.RA *15;//für SternbildPL/E
	//EPH.SternbildPL(EPH.MondE);
	EPH.SternbildE(EPH.MondE);
	EPH.MondE.PhaseD = phase; 	
	EPH.MondE.Name = "Mond";
	EPH.sosys.push(EPH.MondE);
	EPH.Objekte.push(EPH.MondE);
	//EphemTable(EPH.MondE)
	},
	/* =================================================================================== */
	/* 						aktuelles Sternbild für Sonne und Mond 						   */
	SternbildE		:function ()
	{ 
	//var Sternbilder	= new Array("Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc");
	var Sternbilder	= new Array("Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische");
	var stbld 		= (Math.floor(arguments[0].laenge*(180/Math.PI)/30))-1;
	stbld 			= (stbld<0)?stbld=11:stbld;
	arguments[0].Sternbild = Sternbilder[stbld];
	},
/* =================================================================================== */
/* 						aktuelles Sternbild für Planeten/Mond 						       */
	SternbildPL		:function ()
	{
	var aqr = ["Aqr",330,352]; var psc = ["Psc",353,27]; var ari = ["Ari",28,51]; var tau = ["Tau",52,90];
	var gem = ["Gem",91,120]; var  cnc = ["Cnc",121,138]; var leo = ["Leo",139,175]; var vir = ["Vir",176,215];
	var lib = ["Lib",216,238]; var sco = ["Sco",239,246]; var oph = ["Oph",247,266];
	var sgr = ["Sgr",267,302]; var cap =["Cap",303,329];
	var constel = [aqr,psc,ari,tau,gem,cnc,leo,vir,lib,sco,oph,sgr,cap];
	arguments[0].Sternbild = psc[0];
		for(var i=0;i<constel.length;i++)
		{
			if(parseInt(arguments[0].stb) >= constel[i][1] && parseInt(arguments[0].stb) <= constel[i][2])
			{
				arguments[0].Sternbild = constel[i][0];
			}	
		}	
	},
/* =================================================================================== */	
/* 						Klasse der Planeten											   */
	PLANET_E		:function ()
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
	this.schritt			= arguments[9];
	this.anzahl				= arguments[10];
	EPH.EphemerideE(this);
	(this.Name == "Mond")?EPH.Objekte.push(this):null; //hier: nur MOND
	EPH.Objekte.shift();
	},
	/* =================================================================================== */
	/* 						Auswahl und Aufruf der Konstruktoren						   */
	PlanetE			:function()
	{
	/* Erde muss als Rechenwert immer initialisiert werden*/
	EPH.ErdeE = new EPH.PLANET_E(47893,0,0,1.7936477,6.2330541,0.0167134,1.7202111e-2,1.0,"Erde",1,1);
	//akObjekt.wert = arguments[0];

		switch(arguments[0])
		{
		case(1):
		EPH.MerkurE 	= new EPH.PLANET_E(47892.2,0.1222525,0.84147123,1.3491371,6.0300596,0.2056326,0.071424788,0.387099,"Merkur",3,30);
		break;
		case(2):
		EPH.VenusE 		= new EPH.PLANET_E(47893,0.0592457,1.3367448,2.2938906,5.5471223,0.0067777,0.027962453,0.723332,"Venus",3,30);
		break;
		case(3):
		EPH.MarsE 		= new EPH.PLANET_E(47892.7,0.0322837,0.8635947,5.8621241,4.6275694,0.0933958,9.146107e-3,1.523691,"Mars",3,30);
		break;
		case(4):
		EPH.JupiterE 	= new EPH.PLANET_E(46605.0,0.0228027,1.7549514,0.2698787,5.7230009,0.048091,1.45029e-3,5.202629,"Jupiter",5,18);
		break;
		case(5):
		EPH.SaturnE 	= new EPH.PLANET_E(46589.0,0.0434238,1.9835651,1.6024533,2.6642521,0.052072,5.831913e-4,9.547464,"Saturn",14,6);
		break;
		case(6):
		EPH.UranusE 	= new EPH.PLANET_E(46600.5,0.0134931,1.2975635,3.0400461,1.414612,0.045874,2.03741e-4,19.246083,"Uranus",14,6);
		break;
		case(7):
		EPH.NeptunE 	= new EPH.PLANET_E(46630.0,0.0309482,2.2999061,0.2371241,4.5683278,0.008449,1.036272e-4,30.205013,"Neptun",14,6);
		break;
		case(8):
		EPH.PlutoE 		= new EPH.PLANET_E(46600.5,0.2990814,1.9237125,3.9179484,6.1934946,0.24884,6.939604e-5,39.460874,"Pluto",14,6);
		break;
		case(9):
		EPH.LunaE();
		break;								
		default:
		break;
		}
	},
	/* =================================================================================== */
	/*             Berechnung von Rektaszension und Deklination der Planeten 			   */
	/* 			Aufruf als Klassenmethode in PLANETS() durch Ephemeride(this)  			   */
	EphemerideE		:function(planet)
	{
	(EPH.uStart==0)?EPH.JulianischesDatum():void(0);
	var faktor1 = 0.40931976, faktor2 = 6.6711e-7, startwert = 0;
	perihel = EPH.JULIANISCHESDATUM_E.wert - planet.Periheldatum; 
	planet.mittlereAnomalie = planet.mittlereAnomalie + planet.mittlereBewegung * perihel;
		while(Math.abs(planet.mittlereAnomalie) > Math.PI) 
		{
		planet.mittlereAnomalie = planet.mittlereAnomalie - 2 * Math.PI * EPH.Positiv(planet.mittlereAnomalie);
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
		{Radius1 = EPH.Positiv(Radius1) * 1e-8;}
	var laenge = Math.atan(Radius2 / Radius1);
		if(Radius1 < 0)
		{laenge = laenge + Math.PI * EPH.Positiv(Radius2);}
	var omega2 = Math.atan(Radius3 / Math.sqrt(Radius1 * Radius1 + Radius2 * Radius2));
	laenge = laenge + faktor2 * perihel;
//console.log(EPH.SonneE.laenge)	
//console.log(laenge)
	var sekunde = Math.cos(faktor1) * Math.sin(omega2) + Math.sin(faktor1) * Math.sin(laenge) * Math.cos(omega2);
	var dkl = Math.atan(sekunde / Math.sqrt(1 - sekunde * sekunde));
	var dkls = Math.cos(laenge) * Math.cos(omega2);
	sekunde = Math.sin(laenge) * Math.cos(omega2) * Math.cos(faktor1) - Math.sin(omega2) * Math.sin(faktor1);
	var rekt = Math.atan(sekunde / dkls);
		if(dkls < 0)
		{rekt = rekt + Math.PI *  EPH.Positiv(sekunde);}
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
	DKL = DKL * EPH.Positiv(dkl);
	var RAZeiger = RAh + "_" + RAm ;
	//für die Anzeige im Fenster
		RAh=(RAh<10)?"0"+RAh:RAh;
		RAm=(RAm<10)?"0"+RAm:RAm;
	planet.Rektaszension = RAh + "h " + RAm +"m";
	var DklString_0		= (DKL>0)?"+":"-";
	var DklString_1		= (DKL<0)?parseInt(DKL)*-1:parseInt(DKL);
	var DklString_2		= (DklString_1<10 || DklString_1 == 0)?"0"+DklString_1:DklString_1;
	var DklString_3		= DklString_0 + DklString_2 + "° ";
	var dklsString_1 	= (dkls<10 || dkls == 0)?"0"+dkls:dkls;
	planet.Deklination  =  DklString_3 + dklsString_1 + "'";
		if(planet.grosseHalbachse != 1.0)
		{
		planet.stb = (rekt * 12 / Math.PI)*15;//für SternbildPL
		EPH.SternbildPL(planet)
		//Übergabe-> Positionierung des Planetenzeigers
		EPH.sosys.push(planet);
		//EPH.EphemTable(planet);
		}
	},
	//====================================================================================
	/*             Berechnung der Monddaten und Sammeln im Objekt OUTPUT                   */
	/* 				Bestimmung der Daten und Grafiken für die Anzeige                      */
	//------------------------------------------------------------------------------------
	AUSGABE			:[],
	pOld			:0,
	Vollmond		:-1,
	Neumond			:-1,	
	Berechnung		:function()
					{
					EPH.uStart 		= 1;
					EPH.JulianischesDatum(1,EPH.JULIANISCHESDATUM_E.monat-1,EPH.JULIANISCHESDATUM_E.jahr);//DMY
					EPH.JDReverse();
					EPH.JulianischesDatum(EPH.JULIANISCHESDATUM_E.JDTag,EPH.JULIANISCHESDATUM_E.JDMonat,EPH.JULIANISCHESDATUM_E.JDJahr);				
					EPH.OUTPUT[0] = EPH.JULIANISCHESDATUM_E.JDJahr;
						EPH.Objekte.forEach(function(O){
							if(O!=null)
							{
							var ONummer = parseInt(EPH.ArrKey(EPH.Objekte,O));														
								EPH.OUTPUT[ONummer] = {};
								EPH.LunaE(true);
								var p = eval("EPH." +O.Name+ "E.Phase" );
								var s = eval("EPH." +O.Name+ "E.Sternbild" );
								O = eval("EPH." +O.Name+ "E" );							
								EPH.OUTPUT[ONummer].Objektname = O.Name;							
								EPH.OUTPUT[ONummer].Tabelle	= [];							
								EPH.OUTPUT[ONummer].Tabelle.push( {"wotag":EPH.JULIANISCHESDATUM_E.wotag,"datum":EPH.JULIANISCHESDATUM_E.normal,"a":O.Rektaszension,"d":O.Deklination,"p":p,"s":s,"bild":-1,"phase":-1} );	
								EPH.pOld = p;//Vergleichswert zu/abnehmend
									for(var i=1; i<=O.anzahl-1;i++)
									{
									EPH.JULIANISCHESDATUM_E.JD 		+= O.schritt;
									EPH.JULIANISCHESDATUM_E.wert 	+= O.schritt;	
									EPH.JDReverse();
									EPH.JulianischesDatum(EPH.JULIANISCHESDATUM_E.JDTag,EPH.JULIANISCHESDATUM_E.JDMonat,EPH.JULIANISCHESDATUM_E.JDJahr);
									EPH.HeliosE(EPH.JULIANISCHESDATUM_E.JD)	;		
									EPH.LunaE(true);
									var a = eval("EPH." +O.Name+ "E.Rektaszension" );
									var d = eval("EPH." +O.Name+ "E.Deklination" );
									var s = eval("EPH." +O.Name+ "E.Sternbild" );
									var p = eval("EPH." +O.Name+ "E.Phase" );
									var P = (EPH.pOld <p)?"+"+p:"-"+p;
									var phase = (parseFloat(P) < 0)?"abnehmend":"zunehmend";
									EPH.pOld = p;
									var eklipLaengeObj 	= parseInt(eval("EPH." +O.Name+ "E.stb" ));
									var eklipLaengeSol 	= parseInt(EPH.SonneE.stb);
									var posDiff			= (eklipLaengeSol >= eklipLaengeObj)?eklipLaengeSol - eklipLaengeObj:eklipLaengeObj - eklipLaengeSol;							
									EPH.OUTPUT[ONummer].Tabelle.push( {"wotag":EPH.JULIANISCHESDATUM_E.wotag,"datum":EPH.JULIANISCHESDATUM_E.normal,"a":a,"d":d,"p":P,"s":s,"bild":-1,"phase":phase} );									
									} 									
							//Korrektur des Startwerts für den 1. des Monats
							EPH.OUTPUT[0].Tabelle[0]["phase"] = (EPH.OUTPUT[0].Tabelle[1].p < EPH.OUTPUT[0].Tabelle[0].p)?"abnehmend":"zunehmend";
							EPH.OUTPUT[0].Tabelle[0].p = (EPH.OUTPUT[0].Tabelle[1].p < EPH.OUTPUT[0].Tabelle[0].p)?EPH.OUTPUT[0].Tabelle[0].p *-1:EPH.OUTPUT[0].Tabelle[0].p;						
						}
					});
						//Datum Voll/Neu
						EPH.OUTPUT[0].Tabelle.forEach(function(row){
							var wert 		= (row["p"] <0)?row["p"]*-1:parseFloat(row["p"]);
							EPH.Vollmond 	= (wert >0.999)?row["datum"]:EPH.Vollmond;
							EPH.Neumond 	= (wert <0.025)?row["datum"]:EPH.Neumond;
						});
						//Differenz Tag 1
							if(EPH.Vollmond != -1)
							{
							var zaehlTag	= parseInt(EPH.Vollmond.split(".")[0]);
							var tZahl		= 15;
							}
							else
							{
							var zaehlTag	= parseInt(EPH.Neumond.split(".")[0]);
							var tZahl		= EPH.JULIANISCHESDATUM_E.monatLang;							
							}
						var diffTag			= zaehlTag -1;
						var phaseTag		= tZahl-diffTag;//Mondphase am 1. d. Monats
						phaseTag			= (phaseTag <0)?phaseTag*-1:phaseTag;
						EPH.setPhaseImg(phaseTag);			
					EPH.pOld = 0;
					EPH.AUSGABE.push(EPH.OUTPUT[0]);
					EPH.EphemTable();											
					},
	//================================================================================
	TypeOfStart		:function()
					{		
					EPH.Berechnung();					
					/*
					(EphemOnload == 1)
						?EPH.Berechnung()
						:(function(){	
						var win = window.open("ephem.html","select="+document.getElementById("quartal").value +";"+document.getElementById("jahr").value);
						}());
					*/
					},
	//================================================================================
	//Ausgabe
	phasenWert		:0,
	EphemTable		:function()
					{
					var css = 	[
								"h1::text-align:center;font:bold 12pt sans-serif",
								"#Mond::left:20px;",
								"#Mond::top:50px",
								".mondphase::width:20px;height:20px;display:block",
								"table::position:absolute;padding:0px;border:#000 solid 0px;border-collapse:collapse",
								"caption::font:bold 12pt sans-serif",
								"thead th::border-bottom:#000 solid 0px;",
								"th::font:bold 10pt/12pt sans-serif;",
								"td::font:10pt/12pt sans-serif;text-align:right;padding-left:5px;border:#999 solid 0px;",
								".voll > td::background-color:#c00;color:#fff;",
								".neu > td::background-color:#666;color:#fff;font-weight:bold;",
								"tr > td,tr >td +td +td::text-align:center;",
								"tr > td +td::text-align:left;",
								"tr > td +td +td +td +td +td +td ::vertical-align:bottom;",
								"tr > td +td +td +td +td +td +td +td ::vertical-align:middle;",
								];
					css = css.join("|");
					EPH.CREATE.Init(css);
					var jahr 	= EPH.OUTPUT[0];
					EPH.rEle(document.getElementById("Mond"));
					var theader = ["Tag","Datum.","RA","Dkl","beleuchtet","Sternbild","Ansicht","Phase"];
					EPH.OUTPUT.forEach(function(O){
						var tabelle = document.createElement("table");
						tabelle.setAttribute("cellpadding","0");
						tabelle.setAttribute("cellspacing","0");
						tabelle.id	= O.Objektname;
						var caption	= document.createElement("caption");
						var cptText	= document.createTextNode(O.Objektname)
						caption.appendChild(cptText);
						tabelle.appendChild(caption);
						var thead = document.createElement("thead");
						var trh = document.createElement("tr");
							for(var i=0;i<theader.length;i++)
							{
							var thTxt 	= document.createTextNode(theader[i]);
							var th 		= document.createElement("th");
							th.appendChild(thTxt);
							trh.appendChild(th);						
							}
						thead.appendChild(trh)
						tabelle.appendChild(thead);
						var tbody = document.createElement("tbody");
							O.Tabelle.forEach(function(row){
							var tr = document.createElement("tr");
								for(var tupel in row)
								{
									if(row[tupel] != null)
									{										
									var zelle = document.createElement("td"); 									
									//zelle.style.textAlign = (tupel == "s")?"left":"right";
									var daten = (tupel == "p")
										?(function(){
											var wert_0 	= parseFloat(row[tupel]*100);											
											wert_0		= (wert_0 <0)?wert_0*-1:wert_0;
											EPH.phasenWert = wert_0;
											var wert_1 	= parseInt(row[tupel]*100);
											wert_1		= (wert_1 <0)?wert_1*-1:wert_1;
											wert_a 		= wert_0.toString();
											wert_a 		= wert_a.substring(0,4) +"%";
											var wert_2	= (row["p"] <0)?row["p"]*-1:parseFloat(row["p"]);											
											//Zeile hervorheben
											tr.className = (row["bild"] == 15)
											?"voll"
											:(row["bild"] == 0) 
												?"neu"
												:"";
											//-----------------	
											return (wert_1 == 0)?wert_a:wert_1+"%";											 
											}())
										:row[tupel];
									//---------------	
									var wert = (tupel == "bild")
										?(function(){
											var phasenBild 			= document.createElement("img");
											phasenBild.src 			= "../icon2015/mophas/"+row[tupel]+".jpg";
											phasenBild.title 		= row[tupel];
											phasenBild.className 	= "mondphase";
											return phasenBild;
											}())
										:document.createTextNode(daten);																											
									zelle.appendChild(wert);
									tr.appendChild(zelle)
									}
								}
							tbody.appendChild(tr);							
							});
						tabelle.appendChild(tbody);																		
						document.getElementsByTagName("body")[0].appendChild(tabelle);
						});	
					EPH.Vollmond 	= -1;
					EPH.Neumond 	= -1;
					},
	//================================================================================			
	setPhaseImg		:function(phaseTag)
					{
					EPH.OUTPUT[0].Tabelle.forEach(function(row){
					phaseTag 		= (phaseTag >28)?0:phaseTag;
					row["bild"] 	= phaseTag;
					row["phase"] 	= (phaseTag < 15 && phaseTag >0 )
															?"zunehmend"
										:(phaseTag == 15)	?"Vollmond"
										:(phaseTag == 0)	?"Neumond"
										:"abnehmend";
					row["p"] 		= (phaseTag == 0)?0:(phaseTag == 15)?1:row["p"];
					phaseTag++;
					});	
					}
	//================================================================================
}
//window.onload = EPH.Init;
var autoload = (function(){
EphemOnload = 1;	 
	window.setTimeout((function(){(EphemOnload == 1)
		?(function(){
			EPH.Init();
			EPH.Berechnung();
			//(/select/.test(window.name))?EPH.Berechnung():console.log(1);
			}())
		:null;}),100);
}());
//############################################################
//2017-06-12
//############################################################




