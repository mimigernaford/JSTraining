/*
################################
#******************************#
#*    Bibliothek dlib.js      *#
             V c 0.1
      dlibV301 als Klasse
#*       MD 02-12-2022        *#
#******************************#
##       duett.js 2015        ##
################################
*/
class DLIB{
	constructor() {
		//Vars
		this.cssString = 'h1::color:#f00|h2::color:#00f';
		this.selTxt = [];
		this.cssTxt = [];
		//selfstart
		((x) => {
			this.CREATE.Init(this, 0);
		})("run");
	}
	/******************************/
	/*--- ein "SubObjekt" mit eigenen Methoden
	Um mit this auf die Klassenvar. zugreifen zu können, wird via selfstart das umfassende Objekt (Klasse DLIB)
	an die Methode Init des Subobjekts "CREATE" übergeben (s.o.).
	CREATE erzeugt onthefly ein neues Stylesheet im Domtree (head) oder in ein bestehendes css (param: s)
	---*/
	CREATE = {
		Objekt: null,
		sheet: null,
		Btype: function () {
			return (!document.addEventListener) ? this.Objekt.CREATE.appendR1() : this.Objekt.CREATE.appendR0();
			},
		appendR0: function () {
			for (let i = 0; i < this.Objekt.selTxt.length; i++) {
			var rule = this.Objekt.selTxt[i] + "{" + this.Objekt.cssTxt[i] + "}";
			document.styleSheets[this.Objekt.CREATE.sheet].insertRule(rule, 0);
			}
		},
		appendR1: function () {
			for (let i = 0; i < this.Objekt.selTxt.length; i++) {
			var rule = this.Objekt.selTxt[i] + "{" + this.Objekt.cssTxt[i] + "}";
			document.styleSheets[0].addRule(this.Objekt.selTxt[i], this.Objekt.cssTxt[i]);
			}
		},
		Sheet: function (s) {
		this.Objekt.CREATE.sheet 	= s || 0;
		var sheet 					= document.createElement("style");
		sheet.type 					= "text/css";
		document.getElementsByTagName("head")[0].appendChild(sheet);
		this.Objekt.CREATE.Btype();
		},
		Init: function (Objekt, s = 0) {
			this.Objekt = Objekt;
			let css 	= Objekt.cssString.split("|");
			css.forEach(function (x) {
				//console.log(`-> ${x.split("::")[0]}`);
				Objekt.selTxt.push(x.split("::")[0]);
				Objekt.cssTxt.push(x.split("::")[1]);
			});
			Objekt.CREATE.Sheet(s);
		}
	}
	/******************************/
	//Methoden
	/*#-------AJAX v5.0----------#*/
	AJAX(mode,url,sync,para,result,typOfRslt) {
		this.mode       = mode 		|| "GET";
		this.url        = url  		|| "default.txt";
		this.sync       = sync 		|| true;
		this.para       = para 		|| null;
		this.Result		= result 	|| null;
		this.typOfRslt	= typOfRslt || null;
		this.REQUEST	= function(){
						var Request = (window.XMLHttpRequest)?
								   new XMLHttpRequest():
								   new ActiveXObject("Microsoft.XMLHTTP");
							if(Request)
							{
							Request.open(this.mode,this.url,this.sync);
							   if(this.mode == "POST" && this.typOfRslt == null)
							   {
									var Parameters = [];
									var parameter = this.para.split("&");
										for(var i=0;i<parameter.length;i++)
										{
										var parameterName = parameter[i].split("=")[0];
										var parameterWert = encodeURIComponent(parameter[i].split("=")[1]);
										Parameters.push(parameterName + "=" + parameterWert);
										}
									this.para = parameter.join("&");
									Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
									Request.setRequestHeader("Contentlength",this.para.length);
									Request.setRequestHeader("Conection","close");
								}
							Request.after 				= this.Result;
							Request.typOfRslt 			= this.typOfRslt;
							Request.onreadystatechange 	= function(){
															if(Request.readyState == 4){
																if(Request.status == 200){
																	(Request.after!=null)
																	?Request.after(  (Request.typOfRslt == null)?Request:Request.responseText   )
																	:console.log("Code 200: success");}}}
							Request.send(this.para);
							}
						}
	this.REQUEST();
	}
	/******************************/
	/*erzeugt ein Javascript-Stylesheet*/

	/******************************/
	/*entfernt ein Element*/
	rEle(e,nr = 0) {
			if(e != null)
			{
			e = (!e.responseText)
					?(typeof(e) == "object")
						?e
						:(!document.getElementById(e))?document.getElementsByTagName(e)[nr]:document.getElementById(e)
				:document.getElementById(e.responseText);
			(!e)?void(0):e.parentNode.removeChild(e);
			}
	}
	/******************************/
	/*prüft, ob ein Objekt vom Typ Array ist*/
	//ersetzt durch ES2020 "Array.isArray"
	/*is_array(x) {
		if(x
		&& typeof x == "object"
		&& isFinite(x.length)
		&& x.length >= 0
		&& x.length === Math.floor(x.length)
		&& x.length < Math.pow(2,32)
		)
		return true;
		else
		return false;
	}*/
	/******************************/
	//ArrayKey eines Array-Elements ermitteln
	ArrKey(arr,e){
			var key 	= null;
			if(DUETT.is_array(arr))
			{
				key = arr.indexOf(e) || null;
				for(f in arr)
				{key = (arr[f] == e)?f:key;}
			}
			return key;
	}
	/******************************/
	searchKeys(arr,val) {
		var result	= 	DUETT.checkArray(arr,val);
		var res		= 	(typeof result == "object")?(!result.value || result.value == -1)
				?null
				:(!result.key1)?result.key:result.key+","+result.key1
			:null;
		return res;
	}
	/******************************/
	/*benutzt von searchKeys; checkArray auch für Assoz. und mehrdimensionale Arrays*/
	checkArray(O,e) {
			var out = O;
				if(DUETT.is_array(O))
				{
				out = {"values":O.toString()};
				var z = 0;
					for(var f in O)
					{(typeof O[f] != "function")?z++:null;}
				out = (z==0 && O.length ==0)?-1:out;
					if(e && z!=0 && O.length !=0) //normales Array : mehrdim. Array
					{
					out = (O.in_array(e))?{"key":DUETT.ArrKey(O,e),"value":e}
							:(function(e){
								var z = 0;
								O.forEach(function(k){
									out = (DUETT.is_array(k))?(k.in_array(e))?{"key":z,"key1":DUETT.ArrKey(k,e),"value":e}:out:out;
									z++;
								});
							return out;
							}(e));
					}
					if(z!=0 && O.length ==0)//assoz. Array
					{
					var Keys = [];
						for(var f in O)
						{(typeof O[f] != "function")?Keys.push(f):null;}
					out = Keys.join(",");
					Keys.forEach(function(k){
					out = (DUETT.is_array(O[k]))?(O[k].in_array(e))
							?{"key":k,"key1":DUETT.ArrKey(O[k],e),"value":e}:out
							:(!e)?{"keys":Keys.join(",")}:(O[k] == e)?{"key":k,"value":e}:(typeof out == "string")?{"keys":out,value:-1}:out;
						});
					}
				}
			return out;
	}
	/******************************/
	/*Erweitert das Array-Objekt mit der Methode in_array; auch für Assoz. Arrays vom Typ "Literal-Objekt"*/
	/*
	Array.prototype.in_array = function(needle) {
		var inarray = false;
		for(var i=0; i < this.length; i++)
		{inarray = (this[ i] === needle)?true:inarray;}
		inarray = (inarray == false)
			?(function(arr,needle){
				var Xin = false;
				for(f in arr)
				{Xin = (arr[f] === needle)?true:Xin;}
				return Xin;
			}(this,needle))
			:inarray;
		return inarray;
	}
	*/
	/******************************/
	/*Erweitert das Array-Objekt mit der Methode array_unique*/
	/*
	Array.prototype.array_unique = function(){
		var equal 	= this;
		var out		= [];
		for(var i=0; i < this.length; i++)
		{(!out.in_array(this[i]))?out.push(this[i]):null;}
		return out;
	}
	*/
	/******************************/
	/*Erweitert das Array-Objekt mit der Methode array_countMatch: zählt das Vorkommen eines Elements in einem Array*/
	/*
	Array.prototype.array_countMatch = function(search){
		var counter = 0;
		while(DUETT.ArrKey(this,search) != -1)
		{
			counter++;
			this.length = DUETT.ArrKey(this,search);
		}
		return(counter)
	}
	*/

	/******************************/

	/******************************/
}//Ende DLIB








/*
zum Testen
let X = new DLIB();
X.CREATE.Init(X.cssString);



var buch = new Array ();
buch['titel'] = "Ab die Post";
buch['isbn']  = "344254565X";
buch['autor']  = "Pratchet";
buch['pubdate']  = "15.8.2005";

var t = ["buch","titel","autor"];

var x = buch.in_array("Pratchet") || X.ArrKey(buch,"Pratchet");
var z = t.in_array("titel") || X.ArrKey(t,"titel");
console.log(x+"\n"+z)
*/	






















