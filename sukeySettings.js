var canVibrate;
var canUseCompass;
var canUseCamera;
var canUseGeo;
var canUseAjax;
var canUseNativeMap = false;
var SukeyServer = "http://sukey.org/phoneapi";

var URLZoneFromPoint= SukeyServer + "/getZoneFromPoint.php?";
var URLColorWheel =   SukeyServer + "/getcolorwheeldata.php?";
var URLVote =         SukeyServer + "/vote.php";
var URLTicker=        SukeyServer + "/sukey-1.2.php";
var URLReport =       SukeyServer + "/report.php";
var URLKML =          SukeyServer + "/mapview.kml";

var colorset = {'r':'#ff0000', 'g':'#00ff00', 'a':'#ffaa21'};


function showSettings(){
	$('#red').css('background',colorset['r']);
	$('#red').val(colorset['r']);
	$('#amber').css('background',colorset['a']);
	$('#amber').val(colorset['a']);
	$('#green').css('background',colorset['g']);
	$('#green').val(colorset['g']);
	$('#usecamera').attr('checked', canUseCamera);
	$('#usecompass').attr('checked', canUseCompass);
	$('#usegps').attr('checked', canUseGeo);
	$('#usevibrate').attr('checked', canVibrate);
	$('#server').val(SukeyServer);
	if ($('#about').is( ":visible")){ closeAbout();}	
	if ($('#reportdiv').is( ":visible")){ $('#reportdiv').hide(); }
	$('#settingsdiv').css('zIndex','1006');
	$('#settingsdiv').fadeIn();
}
function showcolor(id){
	$('#'+id).css('background',$('#'+id).val());
}
function saveSettings(){
	writestring = '';
	colorset['r'] = $('#red').val();
	writestring += "Red=" + colorset['r'] + "\n";
	colorset['a'] = $('#amber').val();
	writestring += "Amber=" + colorset['a'] + "\n";
	colorset['g'] = $('#green').val();
	writestring += "Green=" + colorset['g'] + "\n";
	canUseCamera = $('#usecamera').attr('checked');
	writestring += "camera=" + canUseCamera + "\n";
	canUseCompass = $('#usecompass').attr('checked');
	writestring += "compass=" + canUseCompass + "\n";
	canUseGeo = $('#usegps').attr('checked');
	writestring += "gps=" + canUseGeo + "\n";
	canVibrate = $('#usevibrate').attr('checked');
	writestring += "vibrate=" + canVibrate + "\n";
	SukeyServer = $('#server').val();
	writestring += "server=" + SukeyServer + "\n";
	setPaths();
	writeSettings(writestring);
	$('#settingsdiv').fadeOut();
	initialise();
}
function cancelSettings(){
	$('#settingsdiv').fadeOut();
}

function setPaths() {
	URLZoneFromPoint= SukeyServer + "/getZoneFromPoint.php?";
	URLColorWheel =   SukeyServer + "/getcolorwheeldata.php?";
	URLTicker=        SukeyServer + "/sukey-1.2.php";
	URLReport =       SukeyServer + "/report.php";
	URLVote =         SukeyServer + "/vote.php";
	URLKML =          SukeyServer + "/mapview.kml";
}

function readSettings(){
    var paths = navigator.fileMgr.getRootPaths();
    var reader = new FileReader();
    reader.onload = gotFile;
    reader.onerror = readFailure;
    reader.readAsText(paths[0] + "sukeySettings.txt");
}

function writeSettings(writeString){
    var paths = navigator.fileMgr.getRootPaths();
    var writer = new FileWriter(paths[0] + "sukeySettings.txt");
    //writer.onwrite = writeSuccess;
    writer.onerror = writeFailure;
    writer.write(writeString); 
}
function writeSuccess(){
	//alert("File written");
}
function writeFailure(){
	alert("File NOT written");
}
function gotFile(evt) {
    var lines = evt.target.result.split("\n");
    for (i=0; i< lines.length; i++){
    	line = lines[i].split('=');
    	//alert (line[0] + ','+ line[1]);
    	switch (line[0]){
	    	case "Red":
	    		colorset['r'] = line[1];break;
	    	case "Amber":
	    		colorset['a'] = line[1];break;
	    	case "Green":
	    		colorset['g'] = line[1];break;
			case "camera":
				canUseCamera = (line[1] ==="true");break;
			case "compass":
				canUseCompass = (line[1] ==="true");break;
			case "gps":
				canUseGeo = (line[1] ==="true");break;
			case "vibrate":
				canVibrate = (line[1] ==="true");break;
			case "server":
				SukeyServer = line[1];break;
			default:
				break;
		}	
    }
    setPaths();
}
function readFailure(evt){
	//alert("Couldn't read stored configuration - using defaults");
}
