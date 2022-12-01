
/*
################################
#******************************#
#*    Bibliothek duett.js     *#
             V 3.0.1
#*       MD 01-12-2022        *#
#******************************#
################################
*/
var DUETT = {
/*#-------AJAX v5.0----------#*/	
AJAX:function(mode,url,sync,para,result,typOfRslt)
	{	
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
	},
/******************************/
/*entfernt ein Element*/
rEle:function(e,nr = 0)
	{
		if(e != null)
		{
		e = (!e.responseText)
				?(typeof(e) == "object")
					?e
					:(!document.getElementById(e))?document.getElementsByTagName(e)[nr]:document.getElementById(e)
			:document.getElementById(e.responseText);
		(!e)?void(0):e.parentNode.removeChild(e);
		}
	},
/******************************/
/*prüft, ob ein Objekt vom Typ Array ist*/
is_array:function(x)
	{
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
	},
/******************************/	
/*erzeugt ein Javascript-Stylesheet*/
CREATE:
	{
	sheet	:null,
	Btype	:function()
			{return (!document.addEventListener)?DUETT.CREATE.appendR1():DUETT.CREATE.appendR0();},			
	appendR0:function()
			{
				for(var i=0;i<DUETT.CREATE.selTxt.length;i++)
				{
				var rule = DUETT.CREATE.selTxt[i]+"{"+DUETT.CREATE.cssTxt[i]+"}";	
				document.styleSheets[DUETT.CREATE.sheet].insertRule(rule,0);
				}					
			},
	appendR1:function()
			{
				for(var i=0;i<DUETT.CREATE.selTxt.length;i++)
				{
				var rule = DUETT.CREATE.selTxt[i]+"{"+DUETT.CREATE.cssTxt[i]+"}";	
				document.styleSheets[0].addRule(DUETT.CREATE.selTxt[i],DUETT.CREATE.cssTxt[i]);
				}	
			},							
	Sheet	:function(s)
			{
			DUETT.CREATE.sheet = s||0;
			var sheet = document.createElement("style");
			sheet.type = "text/css";			
			document.getElementsByTagName("head")[0].appendChild(sheet);
			DUETT.CREATE.Btype();
			},					
	selTxt	:[],
	cssTxt	:[],
	Init	:function(cssString)
			{
			var css = cssString.split("|")
			css.forEach(function(x){
				DUETT.CREATE.selTxt.push(x.split("::")[0]);
				DUETT.CREATE.cssTxt.push(x.split("::")[1]);
				});
			DUETT.CREATE.Sheet();
			}
	},
/******************************/
getStyle:function(element,type,style,num)
	{
	var ret_arr	= [];
	var element = element 	|| "body";
	var type	= type		|| "tag";
	var style	= style		|| "color"
	var num 	= num 		|| 0;
	var Element = (type != null )
				?(function(element,type){
					var Element = (type == "id")	?"document.getElementById(\""+element+"\")":null;
					Element 	= (type == "tag")	?"document.getElementsByTagName(\""+element+"\")["+num+"]":Element;
					Element 	= (type == "name")	?"document.getElementsByName(\""+element+"\")["+num+"]":Element;
					return Element;
					}(element,type))
				:null;
		if(Element != null)
		{	
		//A:IE, B:MOZ
		var typA	= Element+".currentStyle."+style;//nur der angefragte [style]
		var typA_	= Element+".currentStyle";//alle berechneten Styles		
		var typB	= "window.getComputedStyle("+Element+",null)."+style;				
		var typB_	= "window.getComputedStyle("+Element+",null)";
		var css		= (!window.getComputedStyle)?eval(typA):eval(typB);
		var css_	= (!window.getComputedStyle)?eval(typA_):eval(typB_);
		//------------
		var all_css	= [];
			for(var x in css_)
			{
			  if(css_[x] != null)
			  {
				if(isNaN(parseInt(x)) 
					//&& !/Moz/.test(x) 
					&& css_[x].length !=0
					&& /[none|auto|normal]/.test(css_[x]) == false 
					&& !/[-]/.test(x)
					)
				{
				all_css[x] = css_[x];
				}
			  }
			}
		var E = eval(Element);	
		ret_arr["BCR"] 	= E.getBoundingClientRect();//alle Positionen und Dimensionen
		ret_arr["css"]	= css;//nur der angefragte [style]
		ret_arr["css_"] = all_css;//alle berechneten Styles
		console.log(css);
		return ret_arr;
		}
	},
/******************************/ 
//ArrayKey eines Array-Elements ermitteln
ArrKey	:function(arr,e)
		{
		var key 	= null;
			if(DUETT.is_array(arr))
			{
			key = arr.indexOf(e) || null;
				for(f in arr)
				{key = (arr[f] == e)?f:key;}
			}
		 return key; 
		},
/******************************/
/*benutzt von searchKeys; checkArray auch für Assoz. und mehrdimensionale Arrays*/
checkArray:function(O,e)
		{
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
		},
/******************************/		
searchKeys:function(arr,val)		
		{
		var result	= 	DUETT.checkArray(arr,val);
		var res		= 	(typeof result == "object")?(!result.value || result.value == -1)
						?null
						:(!result.key1)?result.key:result.key+","+result.key1
						:null;
		return res;
		},
/******************************/
/*Erzeugt eine HTML-Tabelle, Muster s. u.*/
createTble:function(tdata,container)
		{
			while(document.getElementById(container).hasChildNodes(true))
			{DUETT.rEle(document.getElementById(container).firstChild);}
		var T = document.createElement("table");
		var tag = -1;
			for(daten in tdata)
			{
				(tdata[daten] == 1)
				?(function(){
					tag = document.createElement(daten);
					}())
				:(function(){
						if(DUETT.is_array(tdata[daten]) == true)
						{
						var tagTyp = daten.split("_")[1];
							for(var i=0;i<tdata[daten].length;i++)
							{
							var tr = document.createElement("tr");
							var spalten = tdata[daten][i].split("|");
								for(var s=0;s<spalten.length;s++)
								{
								var Stag = document.createElement(tagTyp);
								var txt = document.createTextNode(spalten[s]);
								Stag.appendChild(txt);
								tr.appendChild(Stag);
								}
							tag.appendChild(tr);
							}										
						T.appendChild(tag);
						}
						else
						{
						var txt = document.createTextNode(tdata[daten]);
						tag.appendChild(txt);
						T.appendChild(tag);
						}
					}())
			}
		document.getElementById(container).appendChild(T);
		},
		/*
		Muster:
		var t1 = 	{
					caption	:1,
					captionT:"Eine Caption 1",
					thead:1,
					thead_th:["Vorname|Name|PLZ"],
					tfoot:1,
					tfoot_th:["Vorname|Name|PLZ"],
					tbody:1,
					tbody_td:["Michael|Dütting|48147","Christina|Diehl|48149","Frank|Krumnöhler|48153"]
					}
		var t2 = 	{
					caption	:1,
					captionT:"Eine Caption 2",
					tbody:1,
					tbody_td:["td1|td2|td3","td1a|td2a|td3a","td1b|td2b|td3b"]
					}			
		*/
/******************************/
sortTble	:function(tabelle,th,dir)
			{
			var table 	= (typeof tabelle == "object")?tabelle:document.getElementById(tabelle);	
			var asc		= (dir == 1)?-1:1;
			var desc	= (dir == 1)?1:-1;
			var tbody 	= table.tBodies[0];
			var rows 	= tbody.getElementsByTagName("tr");
			rows = Array.prototype.slice.call(rows,0);
				rows.sort(function(row1,row2) 
				{
					var cell1 = row1.getElementsByTagName("td")[th];
					var cell2 = row2.getElementsByTagName("td")[th];
					var val1 = cell1.textContent || cell1.innerText || cell1.firstChild.value;
						val1 = (cell1.firstChild.nodeName == "SELECT")?cell1.firstChild.value:val1;
					//	val1 = (!isNaN(parseInt(val1)))?parseInt(val1):val1; //?Zahl
					var val2 = cell2.textContent || cell2.innerText || cell2.firstChild.value;	
						val2 = (cell2.firstChild.nodeName == "SELECT")?cell2.firstChild.value:val2;	
					//	val2 = (!isNaN(parseInt(val2)))?parseInt(val2):val2; //?Zahl											
					if (val1 < val2) 		return asc;
					else if (val1 > val2) 	return desc;
					else return 0;
				});
				for(var i = 0; i < rows.length; i++) tbody.appendChild(rows[i]);			 
			},
/******************************/
_keyStr   : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
b64 	  : function (input) 
			{
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			input = this._utf8_encode(input);

				while (i < input.length) {

					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
					this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
					this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
					}
			return output;
			},		
/******************************/
//UTF-8 encoding
_utf8_encode: function (string) 
			{
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
			},
/******************************/
//validate Date
convertDateFormat:function(zielformat,eingabefeldid,next)			
			{
			//zielformat [String 'dd.mm.yyyy'], eingabe [String], next [String] eval->Object => Methode, die im Anschluss ausgeführt werden soll.
			/*
			Varianten für eingabe: 
			ohne Separator: 1117(4) 010117(6) 20012017(8) 
			mit Separator: 20.01.2017(10) 1.1.17(6)			
			*/
			var targetForm = (zielformat == 'dd.mm.yyyy')?/\d{2}.\d{2}.\d{4}/:/\d{4}-\d{2}-\d{2}/;
			var eingabe = document.getElementById(eingabefeldid).value;
			var datum;
				if(targetForm.test(eingabe))
				{datum = eingabe;} //(10)
				else
				{
					if(!/\./.test(eingabe))
					{
						switch(eingabe.length)
						{
						case(4):
							var tag = eingabe.substring(0,1);
							var mon = eingabe.substring(2,1);								
							var jah = "20"+eingabe.substring(2,4);																
							break;
						case(5):console.log(5); //11115 = 11.1.2015
							var tag = eingabe.substring(0,2);
							var mon = eingabe.substring(2,3);
							var jah = eingabe.substring(3,5);							
								if(tag >31)
								{
								tag = eingabe.substring(0,1);
								mon = eingabe.substring(2,2);
								}
							jah = "20"+jah;	
							break;							
						case(6):console.log(6);
							var tag = eingabe.substring(2,0);
							var mon = eingabe.substring(2,4);
							var jah = "20"+eingabe.substring(4,6);																					
							break;
						case(8):console.log(8);
							var tag = eingabe.substring(2,0);
							var mon = eingabe.substring(2,4);
							var jah = eingabe.substring(4,8);																				
							break;							
						default:
							break;
						}
					}				
				mon = (mon-1 <0)?11:mon-1;	
				e = new Date(jah,mon,tag);
				f = e.toLocaleString('de-DE',{year: 'numeric', month: '2-digit', day: '2-digit'}); 
				datum = f.split(",")[0];			
				document.getElementById(eingabefeldid).value = datum;				
				}
			eval(next);
			}
}//Ende DUETT
//===================================================================================================================
/*erweitert Objekt X mit Methoden und Eigenschaften von Objekt Y: X.extend(Y)*/
Object.defineProperty(Object.prototype,
    "extend",
    {
	writable: true,
	enumerable: false,
	configurable: true,
	value: function(o) {
            var names = Object.getOwnPropertyNames(o);
            for(var i = 0; i < names.length; i++) 
			{
                if (names[i] in this) continue;
			var desc = Object.getOwnPropertyDescriptor(o,names[i]);
			Object.defineProperty(this, names[i], desc);
            }
        }
    });
//=================================================================================================================== 
/*Erweitert das Array-Objekt mit der Methode in_array; auch für Assoz. Arrays vom Typ "Literal-Objekt"*/
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
//===================================================================================================================
/*Erweitert das Array-Objekt mit der Methode array_unique*/
Array.prototype.array_unique = function(){
	var equal 	= this;
	var out		= [];
		for(var i=0; i < this.length; i++)
		{(!out.in_array(this[i]))?out.push(this[i]):null;}	
	return out; 
}
//===================================================================================================================
/*Erweitert das Array-Objekt mit der Methode array_countMatch: zählt das Vorkommen eines Elements in einem Array*/
Array.prototype.array_countMatch = function(search){
	var counter = 0;
		while(DUETT.ArrKey(this,search) != -1)
		{
		counter++;
		this.length = DUETT.ArrKey(this,search);
		}
	return(counter)
}
/*
zum Testen
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






















