Ti.include("gitana/gitana.js");
// use 10.0.2.2 for android
var gitanaContextConfigs = {
    "driver":{
        "serverURL" :'http://api.cloudcms.com:80'
    },
    "repository": {
        "sdk_version": "0.1",
        "sdk_bundle": "theoffice"
    },
    "error" : function(error) {
        Ti.API.error("Error: " + error.message);
        if (error.reason && error.reason == 'INVALID_LOGIN') {
            //gitanaContext.refresh();
            //tabGroup.close();
            loginWin.open();
            statusLabel.text="Invalid Login!";
        }
        if (error.error) {
            Ti.API.error("Error Details: " + error.error.message);
            Ti.API.error("Error : " + JSON.stringify(error.error));
            if (error.error.message == 'The request did not contain a valid Gitana ticket') {
                gitanaContext.refresh();
                tabGroup.close();
                loginWin.open();
            }
        }
    }
};

var gitanaContext;

Titanium.App.addEventListener('logout', function(e) {
    gitanaContext.server().logout();
    loginWin.open();
    tabGroup.close();
});

// Login window
var loginWin = Titanium.UI.createWindow({
    title:'Login',
    //tabBarHidden:true,
    //backgroundColor:'#aebcad'
    backgroundImage:'images/windows/TheOffice_bg_login.png'
});

var tabGroup;

var android = Ti.Platform.name == 'android';

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true
});

var username = Ti.UI.createTextField({
	autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width:250,
	top:210,
    left: android ? 40 :'auto',
	height: android ? 45 : 35,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	hintText:'The Office Username'
});
scrollView.add(username);

username.addEventListener('focus',function() {
    scrollView.scrollTo(0,120);
});

var password = Ti.UI.createTextField({
	autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	width:250,
	top:android ? 265 : 255,
    left: android ? 40 :'auto',
	height:android ? 45 : 35,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	passwordMask:true,
	hintText:'The Office Password'
});
scrollView.add(password);

password.addEventListener('focus',function() {
    scrollView.scrollTo(0,120);
});

var button = Titanium.UI.createButton({
	title:'Login',
	top: android ? 320 : 300,
	width:250,
    left: android ? 40 :'auto',
	height: android ? 45 : 40
});
scrollView.add(button);

var statusLabel = Titanium.UI.createLabel({
	font:{fontSize:18},
	color:'red',
	width:250,
	height: android ? 45 : 40,
	top: android ? 375 : 345,
	text:'',
	textAlign:'center'
});
scrollView.add(statusLabel);

loginWin.add(scrollView);

var navActInd = Titanium.UI.createActivityIndicator();
if (!android) {
	loginWin.setRightNavButton(navActInd);
}

button.addEventListener('click', function()
{
	navActInd.show();
	password.blur();
    if (!gitanaContextConfigs.user) {
        gitanaContextConfigs.user = {};
    }
    gitanaContextConfigs.user['username'] = username.value;
    gitanaContextConfigs.user['password'] = password.value;

    gitanaContext = Gitana.Context.create(gitanaContextConfigs);
    gitanaContext.then(function() {
        loginWin.close();
        // create tab group
        tabGroup = Titanium.UI.createTabGroup();
        //
        // create base UI tab and root window
        //
        var win1 = Titanium.UI.createWindow({
            title:'Products',
            backgroundColor:'#fff',
            url: 'products.js',
            gitanaContext: gitanaContext
        });
        var tab1 = Titanium.UI.createTab({
            icon:'images/tabs/TheOffice_nav_products.png',
            title:'Products',
            window:win1
        });
        var win2 = Titanium.UI.createWindow({
            title:'Categories',
            backgroundColor:'#fff',
            url: 'categories.js',
            gitanaContext: gitanaContext
        });
        var tab2 = Titanium.UI.createTab({
            icon:'images/tabs/TheOffice_nav_categories.png',
            title:'Categories',
            window:win2
        });

        var win3 = Titanium.UI.createWindow({
            title:'Employees',
            backgroundColor:'#fff',
            url: 'employees.js',
            gitanaContext: gitanaContext
        });
        var tab3 = Titanium.UI.createTab({
            icon:'images/tabs/TheOffice_nav_employees.png',
            title:'Employees',
            window:win3
        });

        var win4 = Titanium.UI.createWindow({
            title:'Gitana Software Inc.',
            backgroundColor:'#fff',
            url: 'gitanasoft.js'
        });
        var tab4 = Titanium.UI.createTab({
            icon:'images/tabs/TheOffice_nav_gitana.png',
            title:'Gitana',
            window:win4
        });

        var logoutButton = Ti.UI.createButton({
            title: "Logout",
            style: Ti.UI.iPhone.SystemButtonStyle.DONE

        });

        logoutButton.addEventListener('click', function(e) {
            Ti.App.fireEvent('logout');
        });

        if (!android) {
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
            transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
        });
    });
});

loginWin.open();