(function($) {
	var Roulette = function(options) {
		var defaultSettings = {
			maxPlayCount : null, // x >= 0 or null
			stopItemNumber : null, // x >= 0 or null or -1
			itemNumber : null, //(x number of item)	
			stopCallback : function() {
			},
			startCallback : function() {
			},
			slowDownCallback : function() {
			}
		}
		var defaultProperty = {
			playCount : 0,
			$rouletteTarget : null,
			topspeed : 60,   //x < 360 
			speedupStep : 2 ,
			speeddownStep : 10 ,
			currentSpeed : 0 ,	
			runDuration: 0,
			degreeAdjust: 0,
			resetAdjust:0,
			isSlowdown_adjust: true ,
			isRunUp : true,
			isSlowdown : false,
			isStop : false,
			originalStopImageNumber : null,
			isIE : navigator.userAgent.toLowerCase().indexOf('msie') > -1 ,// TODO IE
			isFF : navigator.userAgent.toLowerCase().indexOf('firefox') > -1 // TODO Firfox
		};
		var p = $.extend({}, defaultSettings, options, defaultProperty);

		var reset = function() {
			p.isSlowdown_adjust=defaultProperty.isSlowdown_adjust;		
			p.isSlowdown = defaultProperty.isSlowdown;
			p.isStop = defaultProperty.isStop;
			p.speed=defaultProperty.currentSpeed;
			p.resetAdjust=defaultProperty.resetAdjust;
		}
		
		var slowDownSetup = function() {
			
			if(p.isSlowdown){
				return;
			}else
			{
				p.isSlowdown=true;
			}
			
		}

		var roll = function() {
			if(p.isSlowdown)
			{
				p.currentSpeed -= p.speeddownStep;
				if(p.isSlowdown_adjust)
				{
					var cur_degree=getRotationDegrees(p.$rouletteTarget);
					p.degreeAdjust=(360-cur_degree-p.resetAdjust)+((p.stopItemNumber *(360/p.itemNumber))- Math.floor((Math.random()*60)));
					
					if (p.isIE) {
					
						p.$rouletteTarget.css({'-ms-transform': 'rotate(' + (cur_degree + p.degreeAdjust) + 'deg)'});
					}else if(p.isFF){
						p.$rouletteTarget.css({'transform': 'rotate(' + (cur_degree + p.degreeAdjust) + 'deg)'});
					}else
					{
						p.$rouletteTarget.css({'-webkit-transform': 'rotate(' + (cur_degree + p.degreeAdjust) + 'deg)'});
					}
					p.isSlowdown_adjust=false;
				}
			}else
			{
				p.currentSpeed += p.speedupStep;
			}
			
			if(p.currentSpeed>p.topspeed)
			{
				p.currentSpeed=p.topspeed;
			}
			  
			var cur_degree=getRotationDegrees(p.$rouletteTarget);
			
			if (p.isIE) {
				p.$rouletteTarget.css({'-ms-transform': 'rotate(' + (cur_degree + p.currentSpeed) + 'deg)'});
			}else if(p.isFF){
				p.$rouletteTarget.css({'transform': 'rotate(' + (cur_degree + p.currentSpeed )+ 'deg)'});
			}else
			{
				p.$rouletteTarget.css({'-webkit-transform': 'rotate(' + (cur_degree +p.currentSpeed) + 'deg)'});
			}

			if(p.isSlowdown && p.currentSpeed==0)
			{
				reset();
			}else if(p.isSlowdown)
			{
				setTimeout(roll, 100);
			}
			else{
				setTimeout(roll, 50);
			}
		}
		
		function getRotationDegrees(obj)
		{
			//var matrix = obj.css("-webkit-transform");
			if (p.isIE) {
				
				matrix = obj.css('-ms-transform');
			}else if(p.isFF){
				matrix = obj.css('transform');
			}else
			{
				matrix = obj.css('-webkit-transform');
			}
			
			if(matrix !== 'none') {
			var values = matrix.split('(')[1].split(')')[0].split(',');
			var a = values[0];
			var b = values[1];
			var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
			} else { var angle = 0; }
			return angle;
		}
		var init = function($roulette) {
			p.$rouletteTarget=$roulette;
			defaultProperty.originalStopImageNumber = p.stopImageNumber;
		}

		var start = function() {
			p.runDuration= 50*(36+(6*Math.floor((Math.random()*12))));
			/***Ban IE Before IE 10***/
			if (navigator.appName == 'Microsoft Internet Explorer')
			{
				 var rv = -1; // Return value assumes failure.
				var ua = navigator.userAgent;
				var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
				rv = parseFloat( RegExp.$1 );
				if(rv<10)
				{
					alert('The Game does not Support You Broswer!')
					return false;
				}
			}
			/***Ban IE Before IE 10***/
			resetAdj();
			roll();
			setTimeout(function(){
				slowDownSetup();
			}, p.runDuration );
		}
		
		var resetAdj = function(){
			for(var i=0; i<p.topspeed; i+=p.speeddownStep)
			{
				p.resetAdjust+=i;
			}	
		}

		var stop = function(option) {
			if (!p.isSlowdown) {
				slowDownSetup();
			}
		}
		var option = function(options) {
			p = $.extend(p, options);
			p.speed = Number(p.speed);
			p.duration = Number(p.duration);
			p.duration = p.duration > 1 ? p.duration - 1 : 1; 
			defaultProperty.originalStopImageNumber = options.stopImageNumber; 
		}

		var ret = {
			start : start,
			stop : stop,
			init : init,
			option : option
		}
		return ret;
	}

	var pluginName = 'roulette';
	$.fn[pluginName] = function(method, options) {
		return this.each(function() {
			var self = $(this);
			var roulette = self.data('plugin_' + pluginName);

			if (roulette) {
				if (roulette[method]) {
					roulette[method](options);
				} else {
					console && console.error('Method ' + method + ' does not exist on jQuery.roulette');
				}
			} else {
				roulette = new Roulette(method);
				roulette.init(self, method);
				$(this).data('plugin_' + pluginName, roulette);
			}
		});
	}
})(jQuery);