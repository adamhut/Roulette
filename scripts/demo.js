$(document).ready(function(e) {
    
	
	var rouletter = $('div.wheel');
	var p={
			stopItemNumber : 1, 
			itemNumber : 5
			};
	rouletter.roulette(p);	
	$('button.start').on('click',function(){
		//alert($('input#stopNumber').val());
		var t=$('input#stopNumber').val();
		var optionreg=/^[1-5]{1}$/;
		
		if(!optionreg.test(t))
		{
			alert(t+'---');
		}else
		{
			//alert(t);
			p['stopItemNumber']=t;
			rouletter.roulette('option', p);	
			rouletter.roulette('start');
		}
		
	});
	$('button.stop').on('click',function(){
		
		var stopImageNumber = $('.stopImageNumber').val();
		if(stopImageNumber == "") {
			stopImageNumber = null;
		}
		rouletter.roulette('stop');	
		
	});
	//alert(navigator.userAgent.toLowerCase());
	//t2();
});
