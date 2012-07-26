/**
 * Common variables and configurations
 */
var win = Ti.UI.currentWindow;
var cloudCMSContext = win.cloudCMSContext;
var whcDomain = win.whcDomain;

var android = Ti.Platform.name == 'android';

if(Ti.Platform.name == 'android') {
	Titanium.UI.currentWindow.backgroundColor = '#4e5c4d';
} else {
	Titanium.UI.currentWindow.backgroundColor = '#ffffff';
}

