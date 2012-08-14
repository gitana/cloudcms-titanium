Ti.include("cloudcms/gitana.js");

var cloudCMSContextConfigs = {
	"driver" : {
		"baseURL" : 'http://api.cloudcms.com:80',
		"clientId" : "676e3450-6131-46c2-99cc-496aa2ad80fa",
		"clientSecret" : "5fGkvesH/tWEMX6SpevL54rY6iJK5ADzLH963sif2ljrWvFOhV2zXv6rSpLF2uMWlJ9SG0uEO9uQO4JZac0i7DZquA/5W8ixJwhj76g0Ksk="
	},
	"authentication" : {
		"username" : "demo",
		"password" : "demo"
	},
	"repository" : {
		"title" : "Creatures Content"
	},
	"error" : function(error) {
		Ti.API.error("Error: " + JSON.stringify(error));
	}
};

Gitana.Context.create(cloudCMSContextConfigs).then(function() {

	this.branch().readNode("creatures:coyote").then(function() {

		var node = this;

		// this sets the background color of the master UIView (when there are no windows/tab groups on it)
		Titanium.UI.setBackgroundColor('#000');

		// create tab group
		var tabGroup = Titanium.UI.createTabGroup();

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
			text : "Hello " + this.getDriver().getAuthInfo().getPrincipalName() + "!",
			font : {
				fontSize : 20,
				fontFamily : 'Helvetica Neue'
			},
			textAlign : 'center',
			width : 'auto'
		});

		win1.add(label1);

		var name = node.getTitle();

		//
		// create controls tab and root window
		//
		var win2 = Titanium.UI.createWindow({
			title : name,
			backgroundColor : '#fff'
		});
		var tab2 = Titanium.UI.createTab({
			icon : 'KS_nav_ui.png',
			title : 'Creature',
			window : win2
		});

		var rows = [];

		var fullImageUrl = node.attachment('photo').getDownloadUri();

		var image = Titanium.UI.createImageView({
			image : fullImageUrl,
			width : '100%',
			height : 290,
			top : 5,
			bottom : 5,
			left : 5,
			right : 5
		});

		var imageRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : ''
		});

		imageRow.add(image);
		rows.push(imageRow);

		var detailsLabel = Ti.UI.createLabel({
			text : node.get("details"),
			color : '#000000',
			shadowColor : '#FFFFE6',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 13
			},
			height : Ti.UI.SIZE,
			width : Ti.Platform.displayCaps.platformWidth - 30,
			top : 10,
			left : 10,
			bottom : 10
		});

		var detailsRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Details'
		});

		detailsRow.add(detailsLabel);

		rows.push(detailsRow);

		// create table view
		var tableViewOptions = {
			data : rows,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor : 'transparent',
			rowBackgroundColor : 'white'
		};

		var tableview = Titanium.UI.createTableView(tableViewOptions);

		win2.add(tableview);

		//
		//  add tabs
		//
		tabGroup.addTab(tab1);
		tabGroup.addTab(tab2);

		// open tab group
		tabGroup.open();
	});
});
