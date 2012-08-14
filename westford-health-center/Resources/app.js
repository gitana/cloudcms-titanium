Ti.include("cloudcms/gitana.js");

// Define Cloud CMS Context and its configurations
var cloudCMSContext, whcDomain;

var cloudCMSContextConfigs = {
	"driver" : {
		"baseURL" : 'http://api.cloudcms.com:80',
		"clientId" : "676e3450-6131-46c2-99cc-496aa2ad80fa",
		"clientSecret" : "5fGkvesH/tWEMX6SpevL54rY6iJK5ADzLH963sif2ljrWvFOhV2zXv6rSpLF2uMWlJ9SG0uEO9uQO4JZac0i7DZquA/5W8ixJwhj76g0Ksk="
	},
	"repository" : {
		"title" : "Westford Health Center Repository"
	},
	"error" : function(error) {
		Ti.API.error("Error: " + JSON.stringify(error));
		if(error.reason && error.reason == 'INVALID_LOGIN') {
			loginWin.open();
			statusLabel.text = "Invalid Login!";
		}
        if (error.error && error.error.status && error.error.status == '401') {
            cloudCMSContext.platform().logout();
            tabGroup.close();
            loginWin.open();
        }
	}
};

// Add listener for lougout
Titanium.App.addEventListener('logout', function(e) {
	cloudCMSContext.platform().logout();
	loginWin.open();
	tabGroup.close();
});

// Create login window
var loginWin = Titanium.UI.createWindow({
	title : 'Login',
	backgroundImage : 'images/windows/WHC_bg_login.png'
});

var tabGroup;

var android = Ti.Platform.name == 'android';

var scrollView = Titanium.UI.createScrollView({
	contentWidth : 'auto',
	contentHeight : 'auto',
	top : 0,
	showVerticalScrollIndicator : true,
	showHorizontalScrollIndicator : true
});

var username = Ti.UI.createTextField({
	autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width : 250,
	top : 210,
	left : android ? 40 : 'auto',
	height : android ? 45 : 35,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText : 'WHC Username'
});
scrollView.add(username);

username.addEventListener('focus', function() {
	scrollView.scrollTo(0, 120);
});

var password = Ti.UI.createTextField({
	autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width : 250,
	top : android ? 265 : 255,
	left : android ? 40 : 'auto',
	height : android ? 45 : 35,
	borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	passwordMask : true,
	hintText : 'WHC Password'
});
scrollView.add(password);

password.addEventListener('focus', function() {
	scrollView.scrollTo(0, 120);
});

var button = Titanium.UI.createButton({
	title : 'Login',
	top : android ? 320 : 300,
	width : 250,
	left : android ? 40 : 'auto',
	height : android ? 45 : 40
});
scrollView.add(button);

var statusLabel = Titanium.UI.createLabel({
	font : {
		fontSize : 18
	},
	color : 'red',
	width : 250,
	height : android ? 45 : 40,
	top : android ? 375 : 345,
	text : '',
	textAlign : 'center'
});
scrollView.add(statusLabel);

loginWin.add(scrollView);

var navActInd = Titanium.UI.createActivityIndicator();
if(!android) {
	loginWin.setRightNavButton(navActInd);
}

button.addEventListener('click', function() {
	navActInd.show();
	password.blur();
	if(!cloudCMSContextConfigs.authentication) {
		cloudCMSContextConfigs.authentication = {};
	}
	cloudCMSContextConfigs.authentication['username'] = username.value;
	cloudCMSContextConfigs.authentication['password'] = password.value;

	cloudCMSContext = Gitana.Context.create(cloudCMSContextConfigs);
	cloudCMSContext.then(function() {

		this.subchain(this.platform()).queryDomains({
			"title" : "Westford Health Center Domain"
		}).keepOne().then(function() {
			whcDomain = this;
		});

		this.then(function() {

			loginWin.close();
			// create tab group
			tabGroup = Titanium.UI.createTabGroup();
			//
			// create base UI tab and root window
			//
			var win1 = Titanium.UI.createWindow({
				title : 'News & Events',
				backgroundColor : '#fff',
				url : 'news_and_events/news_and_events.js',
				cloudCMSContext : cloudCMSContext
			});
			var tab1 = Titanium.UI.createTab({
				icon : 'images/tabs/WHC_nav_news_and_events.png',
				title : 'News & Events',
				window : win1
			});
			var win2 = Titanium.UI.createWindow({
				title : 'Healthy Lifestyles',
				backgroundColor : '#fff',
				url : 'healthy_lifestyles/health_tip_categories.js',
				cloudCMSContext : cloudCMSContext
			});
			var tab2 = Titanium.UI.createTab({
				icon : 'images/tabs/WHC_nav_healthy_lifestyles.png',
				title : 'Healthy Lifestyles',
				window : win2
			});

			var win3 = Titanium.UI.createWindow({
				title : 'WHC Staff',
				backgroundColor : '#fff',
				url : 'staff/employees.js',
				cloudCMSContext : cloudCMSContext,
				whcDomain : whcDomain
			});
			var tab3 = Titanium.UI.createTab({
				icon : 'images/tabs/WHC_nav_staff.png',
				title : 'Staff',
				window : win3
			});

			var win4 = Titanium.UI.createWindow({
				title : 'Westford Health Center',
				backgroundColor : '#fff',
				cloudCMSContext : cloudCMSContext,
				url : 'about_us/whc.js'
			});
			var tab4 = Titanium.UI.createTab({
				icon : 'images/tabs/WHC_nav_about_us.png',
				title : 'About Us',
				window : win4
			});

			var logoutButton = Ti.UI.createButton({
				title : "Logout",
				style : Ti.UI.iPhone.SystemButtonStyle.DONE

			});

			logoutButton.addEventListener('click', function(e) {
				Ti.App.fireEvent('logout');
			});

			if(!android) {
				win1.setRightNavButton(logoutButton);
				win2.setRightNavButton(logoutButton);
				win3.setRightNavButton(logoutButton);
				win4.setRightNavButton(logoutButton);
			}
			//
			//  add tabs
			//
			tabGroup.addTab(tab1);
			tabGroup.addTab(tab2);
			tabGroup.addTab(tab3);
			tabGroup.addTab(tab4);
			// open tab group
			tabGroup.addEventListener('open', function() {
				// set background color back to white after tab group transition
				Titanium.UI.setBackgroundColor('#fff');
			});

			tabGroup.setActiveTab(0);
			// open tab group with a transition animation
			tabGroup.open({
				transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
	});
});

loginWin.open();
