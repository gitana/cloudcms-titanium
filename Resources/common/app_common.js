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

/**
 * Formats time string into hh:mm am/pm
 */
var formatTime = function(timeStr) {
    var arr = timeStr.split(":");
    if (arr.length == 3) {
        var hour = arr[0];
        var ap = "AM";
        if (hour > 11) {
            ap = "PM";
        }
        if (hour > 12) {
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }
        return hour + ":" + arr[1] + " " + ap;
    } else {
        return timeStr;
    }
}

