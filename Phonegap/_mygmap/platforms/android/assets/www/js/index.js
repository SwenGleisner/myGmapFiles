/*
Phonegap/Cordova Tutorial myDeviceApp
 */
var myapp = {
	screenSizePortrait 	: {'height': 0, 'width': 0},
	screenSizeLandscape	: {'height': 0, 'width': 0},

    initialize: function() {
    	var jqReady			= $.Deferred();
		var pgReady			= $.Deferred();
    			
		// Phonegap ready
		document.addEventListener("deviceready", pgReady.resolve, false);
		// jQuery ready
		$(document).bind("ready", jqReady.resolve);
		//Wenn alle Ready wird die Funktion onDeviceReady ausgeführt
		$.when(jqReady, pgReady).then(myapp.onDeviceReady());
		window.addEventListener("orientationchange", myapp.windowTools.updateOrientation, true);
    },
    onDeviceReady: function() {
		var getWindowSizeReady = $.Deferred();
		$(document).on("getWindowSize", getWindowSizeReady.resolve);
		$.when(getWindowSizeReady).done(function(){myapp.windowTools.updateOrientation();});
		myapp.windowTools.getWindowSize();
		myapp.locationTools.getPosition();
		new FastClick(document.body);
    },
    locationTools: {
    	getPosition: function() {
    		var strPositionSuccessReady = "getPositionSuccess";
    		var strPositionErrorReady 	= "getPositionError";
			var getPositionSuccessReady = $.Deferred();
			var getPositionErrorReady = $.Deferred();
			$(document).on(strPositionSuccessReady, getPositionSuccessReady.resolve);
			$(document).on(strPositionErrorReady, getPositionErrorReady.resolve);
			$.when(getPositionSuccessReady).done(function(){
				$('.map-marker-stack').removeClass('text-danger').addClass('text-ok');
				//alert(myPosition.myLongitude);
			});
			$.when(getPositionErrorReady).done(function(){
				$('.map-marker-stack').removeClass('text-ok').addClass('text-danger');
			});
    		//myPosition.initializeGeoFunction(strPositionSuccessReady,strPositionErrorReady);	
    	}
    },
    windowTools: {
    	getWindowSize: function() {
	 		// Orientierung und Abmessungen der Arbeitsfläche auslesen
			if(window.orientation == -90 || window.orientation == 90)
			{
				myapp.screenStartOrientation = "landscape";
	    		myapp.screenSizeLandscape['width'] = $(window).width();
	    		myapp.screenSizeLandscape['height'] = $(window).height();
	    		myapp.screenSizePortrait['height'] = $(window).width();
	    		myapp.screenSizePortrait['width'] = $(window).height();
			}
			else
			{
				myapp.screenStartOrientation = "portrait";	
	    		myapp.screenSizePortrait['height'] = $(window).height();
	    		myapp.screenSizePortrait['width'] = $(window).width();
	    		myapp.screenSizeLandscape['width'] = $(window).height();
	    		myapp.screenSizeLandscape['height'] = $(window).width();
			}
			$(document).trigger("getWindowSize");  		
    	},
    	updateOrientation: function() {
 			if(window.orientation == -90 || window.orientation == 90)
			{
				//Wir befinden uns im Landscape-Modus
		    	var myHeaderHeight = $("div[data-role='header']").outerHeight(); //Die Höhe vom Header wird ausgelesen
				var myFooterHeight = $("div[data-role='footer']").outerHeight(); //Die Höhe vom Footer ...
				var myContentHeight = myapp.screenSizeLandscape['height'] - (myHeaderHeight + myFooterHeight); //Die Höhe des Main wird berechnet
				$("div[role='main']").height(myContentHeight); //Die Höhe des Main-Blocks wird angepasst
				$("#myCanvasWrapper").height(myContentHeight); //Die Höhe des myCanvasWrapper wird angepasst
				$("#myCanvasWrapper").width(myContentHeight); //Die Breite des myCanvasWrapper wird angepasst
				$('#myCanvas').attr( 'height', myContentHeight );
				$('#myCanvas').attr( 'width', myContentHeight );
			}
			else
			{
				//Wir befinden uns im Portrait-Modus
		    	var myHeaderHeight = $("div[data-role='header']").outerHeight(); //Die Höhe vom Header wird ausgelesen
				var myFooterHeight = $("div[data-role='footer']").outerHeight(); //Die Höhe vom Footer ...
				var myContentHeight = myapp.screenSizePortrait['height'] - (myHeaderHeight + myFooterHeight); //Die Höhe des Main wird berechnet
				$("div[role='main']").height(myContentHeight); //Die Höhe des Main-Blocks wird angepasst
				$("#myCanvasWrapper").width(myapp.screenSizePortrait['width']); //Die Breite des myCanvasWrapper wird angepasst
				$("#myCanvasWrapper").height(myapp.screenSizePortrait['width']); //Die Höhe des myCanvasWrapper wird angepasst
				$('#myCanvas').attr( 'height', myapp.screenSizePortrait['width'] );
				$('#myCanvas').attr( 'width', myapp.screenSizePortrait['width'] );
			}    		
    	}
    }
};
