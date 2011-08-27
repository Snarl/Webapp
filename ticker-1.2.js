var itemtime = 5000;
var anns =[];

function emulateRSS(){
alert ("emulating RSS");
var r  = '<?xml version="1.0" encoding="utf-8"?>';
	r += '<sukey version="1.2"><announces>';
	r += '<announce><tickertext>RT @GBCLegal: The picture: over 200 arrests, no one released yet. Lost a mate? Got some info? Call 07946 541 511</tickertext><published>1301221362</published></announce>';
	r += '<announce><tickertext>We were joined by @REALsocialnet last night who shot this in Trafalgar Square http://youtu.be/vre9X49S2pM #26march</tickertext><published>1301220029</published></announce>';
	r += '<announce><tickertext>Man violently detained by police at Trafalgar Square, 26/03/2011 11:13pm http://youtu.be/gfhYSW5Xe_k #march26 #ukuncut</tickertext><published>1301192156</published></announce>'; 
	r += '<announce><tickertext>Man violently detained by police at Trafalgar Square, 26/03/2011 11:13pm http://youtu.be/gfhYSW5Xe_k</tickertext><published>1301192007</published></announce>';
	r += '<announce><tickertext>Police are denying it was a containment area. Roughly 100 people on steps of Nelson\'s column surrounded by sea of riot police</tickertext><published>1301183800</published></announce>'; 
	r += '</announces></sukey>';
	
	var data = $( r );
	anns = data.find('tickertext').contents();
	ticker(anns,0);
}

function getTickerRSS(){
	if (!canUseAjax){
			emulateRSS();
			return;
	}
	$.ajax({
		url: URLTicker,
		failure: function(data){
			setTimeout(getTickerRSS, itemtime * 12);
		},
		success: function(data){
			anns = $(data).find('tickertext').contents();
			ticker(anns,0);
		}
	});
}

function ticker(list,num){
	if(num >= list.length){
		setTimeout(getTickerRSS,itemtime);
	}else{
		jQuery("#ticker").animate(
			{ opacity: 0 }, 500,
			function() { jQuery(this).text(jQuery(list[num]).text()); })
		.animate(
			{ opacity: 1 }, 500,
			function() { setTimeout(function() { ticker(list, num+1); }, itemtime); });
	}
}

