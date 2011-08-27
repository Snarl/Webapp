/*jsl:option explicit*/


var thisImage;


function gatherReport(){
	hideMenu();
	if ($('#about').is( ":visible")){ closeAbout();}
	var report=$('#reportdiv');
	$("#reportwhere").val(cZone);
	$("#reportwhen").val('Now');
	$("#reportwhat").val('See Pics. ');
	report.css('zIndex', 1000);
	report.show();
	return;
}
function submitReport(){
	buzz();
	$('#reportdiv').hide();
    $.post(URLReport,{   
       what: document.getElementById("reportwhat").value,   
       when: document.getElementById("reportwhen").value,   
       where:document.getElementById("reportwhere").value,   
       gps: clat + "," + clon,  
       compass: compassOrientation,
       pic1: document.getElementById("image1").src.slice(23),
       pic2: document.getElementById("image2").src.slice(23),
       pic3: document.getElementById("image3").src.slice(23)
     }, function(xml) {   
        document.getElementById('image1').src="camera.png";   
        document.getElementById('image2').src="camera.png";   
        document.getElementById('image3').src="camera.png";   
     });   
}

function cancelReport(){
	buzz();
	$('#reportdiv').hide();
}
function deletePic(){
	buzz();
	$("#changepic").hide();
	var thumb = document.getElementById('image'+thisImage);
	thumb.src="camera.png";
}
function keepPic(){
	buzz();
	$("#changepic").hide();
}
function reviewPhoto(imageid){
	buzz();
	var image = document.getElementById('thisPic');
	var thumb = document.getElementById('image'+imageid);
	var scale = Math.min(displayWidth/thumb.naturalWidth, (displayHeight - 120)/thumb.naturalHeight);
	image.src = thumb.src;
	image.style.width= image.naturalWidth * scale +"px";
	image.style.height = image.naturalHeight * scale + "px";
	$('#changepic').css('zIndex', 1001);
	$('#changepic').show();	
}
function photoReport(imageid){
	thisImage=imageid;
	var image=document.getElementById('image' + imageid);
	if (image.src.slice(-10)=="camera.png"){
		if (canUseCamera){
		    navigator.notification.confirm(
		    		'Where shall I get the image from?',
		    		 photoReport2,
		    		'Add Image to Report',
		    		'Camera,Album');
		} else {
			$('#files').click();
		}
	} else {
		reviewPhoto(imageid);
	}	
}	
function photoReport2(n){	
	navigator.camera.getPicture(photoOnSuccess, photoOnFail, { quality: 50, sourceType: n });
}

function photoOnSuccess(imageData) {
    var image = document.getElementById('image'+thisImage);
    image.src = "data:image/jpeg;base64," + imageData;
}

function photoOnFail(message) {
    alert('No Picture because: ' + message);
}

function handleFileSelect(evt) {
    var files = evt.target.files; 
    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image/jpeg.*')) {
		alert("Only jpg files, please");
        continue;
      }
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
        	document.getElementById('image'+thisImage).src=e.target.result;
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }
