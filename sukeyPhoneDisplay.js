/*jsl:option explicit*/


var canvas;
var ctx;				//2d canvas context
var cx;
var cy; 
var segradius;
var innerRadius; 
var clat = null;
var clon = null;
var wheeldata=[];
var cZone = null;
var font20;
var font15;
var font10;
var compassId = null;
var geoId = null;
var compassOrientation = null;
var lookingforsats = "Scanning the Heavens";

var grad;

function initialiseCanvas(){
	cx = canvas.width/2;
	cy = canvas.height/2;
	segradius = Math.min(cx,cy) * 0.98;
	innerRadius = segradius * 0.8;
	font20 = Math.round(cx/100*20) + "px  Sans-Serif";
	font15 = Math.round(cx/100*15) + "px  Sans-Serif";
	font10 = Math.round(cx/100*10) + "px  Sans-Serif";
	ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#000000";
	grad = ctx.createRadialGradient(cx,cy,segradius,cx,cy,innerRadius); 
	grad.addColorStop(0, '#cccccc');
	grad.addColorStop(1, '#666363');
}

function initialiseCompass(){
	mode="compass";
	initialiseCanvas();
	if (cZone === null)	{cZone = lookingforsats;}
	if (clat === null){
		clat = 51.500181;
		clon = -0.12619;
		cZone="Parliament Square";
	 	getwheel();
	} 	
	if (compassId === null) startCompass();
	if (canUseGeo && (geoId === null)){
		initiate_geolocation();
	} 
}

function startCompass() {
	// Update compass every 0.1 seconds
	var options = { frequency: 100 };
	if (canUseCompass) {
		stopCompass();
		compassId = navigator.compass.watchHeading(onCompassSuccess, onCompassError, options);
	} else {	
		draw();
	}	
	
}
function restartCompass(){
	stopCompass();
	startCompass();
}
function stopCompass() {
	if (compassId) {
		navigator.compass.clearWatch(compassId);
		compassId = null;
	}
}

function onCompassSuccess(heading) {
	if (compassOrientation !== heading){
		compassOrientation = heading;
		draw();
	}	
}

function onCompassError(error){
	if (error !== undefined){
		stopCompass();
		if (error.code === undefined){
			alert ("Compass Failed");
		}
	    navigator.notification.confirm(
	        'code: ' + error.code + '\nmessage: ' + error.message,
	        'restartCompass',
	        'Compass Error',
	        'OK' );
	    setTimeout(restartCompass,1000);
	}
}


function getwheel(){
      if (cZone && cZone != "Unknown Zone"){
			var $url=  URLColorWheel + "loc=" + clat + "," + clon + "&zone=" + cZone;
			$.ajax({
			type: "GET",
			url: $url,
			error: function(xml){
			},
			success: function(xml){
				  wheeldata.length=0;
				  $(xml).find("exit").each(function(){
					var exitName=$(this).attr("leadsto");					
					exitName=exitName.split('|');
					wheeldata.push([parseFloat($(this).attr("b1")), parseFloat($(this).attr("b2")), $(this).attr("status").charAt(0), exitName[0] ]);
				  });				
				  draw();
				}
			});
	  } else {
		  wheeldata.length = 0;
		  draw();
	  }
}

function drawseg(fromangle, toangle, color){
	fromangle = fromangle - compassOrientation;
	toangle = toangle - compassOrientation;
	//alert(color);
	ctx.fillStyle = colorset[color];
	ctx.beginPath();
	ctx.moveTo(cx,cy);
	ctx.arc(cx,cy,segradius,Math.PI*2*(fromangle)/360 + Math.PI,Math.PI*2*(toangle)/360 + Math.PI,false);
	ctx.lineTo(cx,cy);
	ctx.closePath();
	ctx.fill();
}


function drawInnerCircle(){
	ctx.beginPath();
    var lingrad = ctx.createLinearGradient(0,0,0,innerRadius * 2);
    //lingrad.addColorStop(0, '#E0E0E0');
    //lingrad.addColorStop(1, '#7a7a7a');
    lingrad.addColorStop(0, '#F0F0F0');
    lingrad.addColorStop(1, '#4a4a4a');
	ctx.arc(0,0,innerRadius,Math.PI*2,0,true);
    ctx.fillStyle = lingrad;
	ctx.closePath();
    ctx.fill();
}

function drawStar(){
	 var ir = innerRadius * 0.8;
	 var d=parseInt(ir * 0.1)+1;
	 ctx.beginPath();
	 ctx.moveTo(0,0);
	 ctx.lineTo(-d,d);ctx.lineTo(0,ir);ctx.lineTo(0,0);
	 ctx.lineTo(ir,0);ctx.lineTo(d,d);ctx.lineTo(0,0);
	 ctx.lineTo(0,-ir);ctx.lineTo(d,-d);ctx.lineTo(0,0);
	 ctx.lineTo(-ir,0);ctx.lineTo(-d,-d);ctx.lineTo(0,0);
	 ctx.closePath();
	 ctx.fillStyle = "#BaBaBa";
	 ctx.fill();
	 
	 ctx.beginPath();
	 ctx.moveTo(0,0);
	 ctx.lineTo(d,d);ctx.lineTo(0,ir);ctx.lineTo(0,0);
	 ctx.lineTo(ir,0);ctx.lineTo(d,-d);ctx.lineTo(0,0);
	 ctx.lineTo(0,-ir);ctx.lineTo(-d,-d);ctx.lineTo(0,0);
	 ctx.lineTo(-ir,0);ctx.lineTo(-d,d);ctx.lineTo(0,0);
	 ctx.closePath();
	 ctx.fillStyle = "#EaEaEa";
	 ctx.fill();
}
function drawPoints(){
	 ctx.beginPath();	 
     ctx.textAlign = "center";
	 ctx.textBaseline = 'top';
	 ctx.font=font15;
	 ctx.fillStyle = "#d42929";
     ctx.fillText("N", 0, -innerRadius);
	 ctx.rotate (Math.PI/2);
	 ctx.fillStyle = "#FFFFFF";
     ctx.fillText("E", 0, -innerRadius);
	 ctx.rotate (Math.PI/2);
     ctx.fillText("S", 0, -innerRadius);
	 ctx.rotate (Math.PI/2);
     ctx.fillText("W", 0, -innerRadius);
	 ctx.closePath();
     ctx.stroke();
     ctx.fill();
}
function drawNorth(){
	 ctx.save();
 	 ctx.translate(cx, cy);
     ctx.rotate(Math.PI*2*(-compassOrientation/360));	 
	 drawInnerCircle();
	 drawStar();
	 drawPoints();
     ctx.restore();
}
function draw() {
	if (mode!=="compass"){return;}

	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.arc(cx,cy,segradius,Math.PI*2,0, true);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	if (wheeldata.length > 0){
		for (var i=0; i < wheeldata.length; i++){
			drawseg( wheeldata[i][0], wheeldata[i][1], wheeldata[i][2]);
		}
		$('#votebuttondiv').show();
	} else {
		$('#votebuttondiv').hide();
	}
    drawNorth();

	var loctext; //2nd Line
	if (clat){
		loctext = (Math.round(clat * 100000)/100000) + ", " + (Math.round(clon * 100000)/100000) + ", " + compassOrientation;
	} else {
		if (cZone == lookingforsats){
			loctext = "looking for satellites";
		} else {
			loctext = 'Satellite fix lost';
		}	
	}

	ctx.fillStyle    = '#000009';
	ctx.font         = font15;
	ctx.textAlign    = 'center';
	
	ctx.textBaseline = 'bottom';
	ctx.fillText(cZone, cx, cy); 
	ctx.font         = font10;
	ctx.textBaseline = 'top';
	ctx.fillText(loctext, cx, cy); 		
}
function initiate_geolocation() {  
	if (canUseGeo){
		if (geoId === null){
			geoId=navigator.geolocation.watchPosition(handle_geolocation_query, geo_error, { maximumAge: 5000, timeout: 180000, enableHighAccuracy: true });  
		}
	} else {
		var g = prompt("Can't use Geo - Enter lat,lng separated by comma");
		g = g.split(',');
		cLat = g[0];
		cLon = g[1];
	}	
}  

function geo_error(error){
	switch (error.code){
		case 2:
			alert ("No position locator found.\nPlease switch your GPS on.");
			break;
		case 3:
			alert ("Couldn't get your satellite location.  Will try again in 5 mins.\nContinuing without GPS.");
			canUseGeo = false;
			stopGeo();
			setTimeout(initiate_geolocation,300000);
			break;
		default:
    		alert('Geolocation Error\ncode: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
			break;
	}
}
function handle_geolocation_query(position){
	if (mode=="compass"){
		setNewFoneLocation(position.coords.latitude,position.coords.longitude);
	} else {
		locatesuccess(position);
	}
}
function stopGeo(){
	if (geoId !== null){
		navigator.geolocation.clearWatch(geoId);
	}
}

function setNewFoneLocation(lat, lng){
	clat = lat;
	clon = lng;
	$.ajax({
	   type: "GET",
	   url: URLZoneFromPoint + "point=" + clat + "," + clon,
	   success: function(msg){
						cZone=msg;
						getwheel();
					}
	});
}
