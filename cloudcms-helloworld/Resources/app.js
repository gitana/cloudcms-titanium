Ti.include("cloudcms/gitana.js");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

new Gitana({
	"baseURL" : 'http://api.cloudcms.com:80',
	"clientId" : "676e3450-6131-46c2-99cc-496aa2ad80fa",
	"clientSecret" : "5fGkvesH/tWEMX6SpevL54rY6iJK5ADzLH963sif2ljrWvFOhV2zXv6rSpLF2uMWlJ9SG0uEO9uQO4JZac0i7DZquA/5W8ixJwhj76g0Ksk="
}).authenticate({
	"username" : "demo",
	"password" : "demo"
}).then(function() {

	var authInfo = this.getDriver().getAuthInfo();

	//
	// create base UI tab and root window
	//
	var win1 = Titanium.UI.createWindow({
		title : 'Tab 1',
		backgroundColor : '#fff'
	});
	var tab1 = Titanium.UI.createTab({
		icon : 'KS_nav_views.png',
		title : 'Tab 1',
		window : win1
	});

	var label1 = Titanium.UI.createLabel({
		color : '#999',
		text : "Hello " + authInfo.getPrincipalName() + "!",
		font : {
			fontSize : 20,
			fontFamily : 'Helvetica Neue'
		},
		textAlign : 'center',
		width : 'auto'
	});

	win1.add(label1);

	//
	// create controls tab and root window
	//
	var win2 = Titanium.UI.createWindow({
		title : 'Tab 2',
		backgroundColor : '#fff'
	});
	var tab2 = Titanium.UI.createTab({
		icon : 'KS_nav_ui.png',
		title : 'Tab 2',
		window : win2
	});

	var label2 = Titanium.UI.createLabel({
		color : '#999',
		text : 'I am Window 2',
		font : {
			fontSize : 20,
			fontFamily : 'Helvetica Neue'
		},
		textAlign : 'center',
		width : 'auto'
	});

	win2.add(label2);

	//
	//  add tabs
	//
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);

	// open tab group
	tabGroup.open();
});

