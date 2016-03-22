// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var g_progress = 0;


(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			$ele.css('visibility','visible');



			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;

					$('body,html').animate(
	        	{scrollTop:( $ele.offset().top -80 )},500
          );

				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					g_progress ++;

					var btn = $("#go-" + g_progress);
					btn.css('visibility','visible');
					btn.click(function(){
						$( "#p" + (g_progress + 1) ).typewriter();
					});

					

					clearInterval(timer);
				}
			}, 160);
		});
		return this;
	};




})(jQuery);





function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}