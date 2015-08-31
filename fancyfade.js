
var textBottomPadding = 300;

var viewHeight;
var animations; //animation ranges –– if scroll is in the range, start the animation - otherwise, end the animation
var animationFunctions = [
		page1TextFade
];
var animStates = new Array();

function generateAnimationRanges(){
	var pageOffset = $("#page1").offset().top;
	var pageHeight = $("#page1").height();
	console.log("page1offset:"+pageOffset+" -- page2Offset:"+pageHeight);
	var page1TextFade =[pageOffset, pageOffset+pageHeight];
	animations = [page1TextFade];
	for(var i=0; i<animations.length; i++){
		animStates[i]=0;
	}
}

var tasteUnlocked = true;
function page1TextFade(pComplete, animIndex){
	var translateY = -(pComplete * $("#page1").height());
	$("#page1-centering-box").css({'-webkit-transform':'translate3d(0px,' + translateY + 'px,0px)'});

	if(scrollDelta==0 ){
		if(tasteUnlocked && pComplete < 1 && pComplete > 0){
			$("#page1-bg").css({'position':'fixed'});
			$("#page1-fade-container").css({'position':'fixed'});
			tasteUnlocked = false;
		}
	}else if (scrollDelta>=0){ // scrolling down
		if(pComplete==0){ //unlock overflow
			if(tasteUnlocked){
				$("#page1-bg").css({'position':'fixed', 'margin-top':-viewHeight+'px'});
				$("#page1-fade-container").css({'position':'fixed'});
				tasteUnlocked = false;
			}
		} else if(pComplete == 1){ //lock overflow
			if(!tasteUnlocked){
				$("#page1-bg").css({'position':'absolute', 'margin-top':'0px'});
				$("#page1-fade-container").css({'position':'absolute'});
				tasteUnlocked = true;
			}
		}
	} else { //scrolling up
		if(pComplete==0){ //lock overflow
			if(!tasteUnlocked){
				$("#page1-bg").css({'position':'absolute', 'margin-top':'0px'});
				$("#page1-fade-container").css({'position':'absolute'});
				tasteUnlocked = true;
			}
		} else if(pComplete == 1){ //unlock overflow
			if(tasteUnlocked){
				$("#page1-bg").css({'position':'fixed', 'margin-top':-viewHeight+'px'});
				$("#page1-fade-container").css({'position':'fixed'});
				tasteUnlocked = false;
			}
		}
	}
	
}

//PARALLAX
var scrollTop = 0;
var lastPosition = 0;
var scrollDelta = 0;

setScrollTops = function() {
	scrollTop = $(window).scrollTop();
	scrollDelta = scrollTop - lastPosition;
}

var scrollingLocked = "nil";
updatePage = function() {
	window.requestAnimationFrame(function() {
	    setScrollTops();
	    for(var i=0; i<animations.length; i++){
			if(scrollTop >= animations[i][0] && scrollTop < animations[i][1]){
				if(animStates[i]==0){ //initialize animation
					var pcInit = 0;
					if(scrollDelta<0){pcInit = 1;}
					animationFunctions[i](pcInit, i); 
					animStates[i] = 1; //state is active
				} else {
					var percentComplete = (scrollTop-animations[i][0])/(animations[i][1]-animations[i][0]);
					animationFunctions[i](percentComplete, i);
				}
			} else if (animStates[i] == 1){ //because outside anim range, but still on
				var percentComplete = 1;
				if(scrollDelta<0){
					percentComplete = 0;
				}
				animationFunctions[i](percentComplete, i);
				animStates[i] = 0;
			}
		}
		lastPosition = scrollTop; 
	});
}

function adjustPageSizings(){
	var tasteTextHeight = $("#page1-centering-box").height() *1.3;
	$("#page1").css({'height':tasteTextHeight+'px'});
}

init = function() {
	viewHeight = $(window).height();
	// calculateScrollVals();
	adjustPageSizings();
	generateAnimationRanges();
	
	scrollIntervalID = setInterval(updatePage, 10);
}

init();

$(window).on('resize', function () {
	adjustPageSizings();
	generateAnimationRanges();
});