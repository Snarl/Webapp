/*jsl:option explicit*/


var votearray =[];
var voteZone;

function voteExit(){
	hideMenu();
	voteZone=cZone;
	votearray.length=0;
	if ($('#about').is( ":visible")){ closeAbout();}		
	var vote=$('#votediv');
	vote.css('zIndex', 1000);
	vote.slideDown();
	var thistable = "<table width=100%><tbody  id='votetable'><tr><th width='*'>Exit Name</th><th width='30px' style='background:" + colorset['g'] + "'></th><th width='30px' style='background:" + colorset['a'] + "'></th><th width='30px' style='background:" + colorset['r'] + "'</th></tr>";
	
	for (i=0; i< wheeldata.length; i++){
		exitarr = wheeldata[i];
		thistable += "<tr><td style='color:black;background:" + colorset[exitarr[2]] + "'>" + exitarr[3]+ "</td><td style='background:#eeeeee;height:35px' onclick='voteMe(+1," + i +");'>+</td><td style='background:#eeeeee;height:35px' onclick='voteMe(0," + i +");'>+</td><td style='background:#eeeeee' onclick='voteMe(-1,"+i+");'>+</td></tr>";
	}
	thistable +="</tbody></table>";
	
	thistable +="<div style='width:100%; bottom:10px'>";
	thistable +="<div style='position:absolute;left:0px; bottom:5px;background=#999999'  onclick='cancelVote();'><img src='reportcancelbutton.png' style='float:left'><div style='float:left;padding:7px 0px;background:#999999'>&nbsp;Cancel&nbsp;<BR/>&nbsp;Status&nbsp;</div></div>";
	thistable +="<div style='position:absolute;right:0px; bottom:5px; background=#999999' onclick='submitVote();'><img src='reportsendbutton.png' style='float:right'><div style='float:right;padding:7px 0px;background:#999999'>&nbsp;Submit&nbsp;<BR/>&nbsp;Status&nbsp;</div></div>";
	thistable += "</div>";
	vote.append(thistable);
}
function cancelVote(){
	$('#votediv').slideUp();
	$('#votediv').empty();
	for(key in votearray){
		delete votearray[key];
	}
}
function submitVote(){
	var msg='';
	for(key in votearray){
		msg+= "$,$" + key + "$:$" + votearray[key];
		delete votearray[key];
	}
	votearray.length=0;
	if (msg.length > 1){
			msg = msg.substr(2);
		    $.post(URLVote,{   
		       where: voteZone,   
		       exits: msg.slice(1) 
		     }, function(xml) {  
		     	if (xml.length > 3){ 
					alert(xml);
				}
				setNewFoneLocation(clat, clon);
		     });  
	}
	$('#votediv').slideUp();
	$('#votediv').empty();
}
function voteMe(score, exitid){
	var thisrow=$('#votetable').children(':eq(' + ( 1 + exitid) + ')');	
	switch (score){
		case 1:
			thisrow.children(':eq(0)').css('background',colorset['g']);
			thisrow.children(':eq(1)').css('background',colorset['g']);
			thisrow.children(':eq(2)').css('background','#EEEEEE');
			thisrow.children(':eq(3)').css('background','#EEEEEE');
			break;
		case 0:
			thisrow.children(':eq(0)').css('background',colorset['a']);
			thisrow.children(':eq(1)').css('background','#EEEEEE');
			thisrow.children(':eq(2)').css('background',colorset['a']);
			thisrow.children(':eq(3)').css('background','#EEEEEE');
			break;
		case -1:
			thisrow.children(':eq(0)').css('background',colorset['r']);
			thisrow.children(':eq(1)').css('background','#EEEEEE');
			thisrow.children(':eq(2)').css('background','#EEEEEE');
			thisrow.children(':eq(3)').css('background',colorset['r']);
			break;
	}
	votearray[wheeldata[exitid][3]] = score;
}
