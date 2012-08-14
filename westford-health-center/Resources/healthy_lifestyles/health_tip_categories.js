/**
 * Creates category list for health tips.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");

cloudCMSContext.branch().readNode('whc:healthtips').then(function() {

	var data = [];

	this.listChildren().each(function() {
		data.push( Ti.UI.createTableViewRow({
			hasDetail : true,
			title : this.getTitle(),
			nodeId : this.getId()
		}));
	});

	this.then(function() {
		// create table view
		var tableview = Titanium.UI.createTableView({
			data : data
		});

		// create table view event listener
		tableview.addEventListener('click', function(e) {
			var category = e.rowData.title;
			var nodeId   = e.rowData.nodeId;
			var categoryWin = Ti.UI.createWindow({
				url : 'health_tips_by_category.js',
				title : category,
				backgroundColor : '#fff',
				category : category,
				nodeId : nodeId,
				cloudCMSContext : cloudCMSContext
			});
			Ti.UI.currentTab.open(categoryWin);
		});

		// add table view to the window
		Titanium.UI.currentWindow.add(tableview);
	});
});
