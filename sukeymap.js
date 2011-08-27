/*jsl:option explicit*/
var defaultloc = new google.maps.LatLng(51.50348, -0.126901);
var currloc = null;
var map;
var me = null;
var followMe = true;
var marker;

function closeMap(){
	var scr = document.getElementById('scr');
	var dad=scr.parentNode;
	if(dad){
		dad.removeChild(scr);
	}
	marker = null;
	scr = document.createElement("div");				
	scr.setAttribute('id', 'scr');
	scr.style.width= displayWidth + "px";
	scr.style.height= displayHeight - 96 + "px";
	scr.style.top= "96px";
	scr.style.margin = "0 auto";
	scr.style.position="relative";
	scr.style.textAlign = "center";
	my_div = document.getElementById("buttondiv");
	scr = document.body.insertBefore(scr, my_div);
	vote = document.createElement("div");
	vote.setAttribute('id','votebuttondiv');
	vote.style.bottom="10px";
	vote.style.display="none";
	vote.innerHTML=	"<div style='float:right'><img src='reportsendbutton.png'></div><div style='float:right;padding:17px 0px;'>&nbsp;Give your opinion&nbsp;</div>";
	vote.addEventListener("click", voteExit);
	scr.appendChild(vote);
}



function initMap(divname) {
	mode="map";
	if (canUseNativeMap){
		initNativeMap(divname);
	} else {
		initGoogleMap(divname);
	}
}
function initNativeMap(divname){
	document.location = 'openmap:london';
}

function initGoogleMap(divname){
	if (clat){
		currloc = new google.maps.LatLng(clat, clon);
		defaultloc = currloc;
	}
	map = new google.maps.Map(
		document.getElementById(divname), {
			zoom: 16,
			center: defaultloc,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			draggable: true
		}
	);

	mapviewlayer = new google.maps.KmlLayer(
		URLKML, {
			map: map,
			preserveViewport: true,
			clickable: false
		}
	);
    
	  marker = new google.maps.Marker({
      position: currloc, 
      map: map, 
      title:"You are here"
  }); 
  if (!canUseGeo){
  	marker.setDraggable(true);
    google.maps.event.addListener(marker, 'dragend', function() {
    moveMapPin();
  });
  }  
}
function moveMapPin(){
	defaultloc = marker.getPosition();
	setNewFoneLocation(marker.getPosition().lat(), marker.getPosition().lng());
}

function locateError() {
	if (currloc === null) {
		currloc = defaultloc;
	}
}

function locateSuccess(pos) {
	if (currloc !== pos){	
		currloc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		clat = pos.coords.latitude;
		clon = pos.coords.longitude;
		
		if (me === null) {
			var bounds = new google.maps.LatLngBounds(defaultloc, defaultloc);
			bounds.extend(currloc);
			map.fitBounds(bounds);
			me = new google.maps.Marker({
				map: map,
				draggable: false,
				animation: google.maps.Animation.DROP,
				position: currloc
			});
		}
		if(followMe) {
			map.setCenter(currloc);
			followMe = false;
		}
	}
}
