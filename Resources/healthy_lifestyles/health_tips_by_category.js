/**
 * Displays list of health tips of a given category.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");
Ti.include("../common/content_common.js");

var nodeId = win.nodeId;

var rows = [];

var table;
var hasMoreNodes = true;
var batchSize = 3;
var loadedNodesCounter = 0;
var hasMoreRow = null;

var createHasMoreRow = function() {
	hasMoreRow = Ti.UI.createTableViewRow({
		height : 'auto',
		title : 'More ...'
	});
	table.appendRow(hasMoreRow);
};

var deleteHasMoreRow = function() {
	if(hasMoreRow != null) {
		var index = loadedNodesCounter + 1;
		try {
			table.deleteRow(index, {
				animationStyle : Titanium.UI.iPhone.RowAnimationStyle.UP
			});
			hasMoreRow = null;
		} catch (E) {
			Ti.UI.createNotification({
				message : E.message
			}).show();
		}
	}
};

var addBatchRows = function() {
	cloudCMSContext.branch().readNode(nodeId).listChildren({
		"skip" : loadedNodesCounter,
		"limit" : batchSize
	}).count(function(count) {
		if(count < batchSize) {
			hasMoreNodes = false;
		}
	}).each(function(key, node, index) {

		var thumbnailUrl = null;

		this.listAttachments(true).then(function() {
			if(this.map["thumb"]) {				this.select("thumb").then(function() {
					thumbnailUrl = this.getDownloadUri();
				});
			} else if (this.map["default"]) {
				this.select("thumb").then(function() {
					thumbnailUrl = this.getDownloadUri();
				});
			}
		});

		this.then(function() {

			Ti.API.info("image " + thumbnailUrl);

			var row = createListItemView({
				id : node.getId(),
				type : node.getTypeQName(),
				title : node.get('title'),
				thumbnailUrl : thumbnailUrl,
				details : node.get('teaser')
			});

			Ti.API.info("loadedNodesCounter " + loadedNodesCounter);
			
			if(loadedNodesCounter == 0) {
				table.appendRow(row);
			} else {
				table.insertRowAfter(loadedNodesCounter-1, row);
			}
			loadedNodesCounter++;
		});
		
	}).then(function() {
		if(!hasMoreNodes) {
			deleteHasMoreRow();
		} else {
			if(hasMoreRow == null) {
				createHasMoreRow();
			}
		}
	});
};

win.addEventListener('refresh', function(e) {
    for (var index = 0; index < loadedNodesCounter; index ++) {
        table.deleteRow(0, {
            animationStyle : Titanium.UI.iPhone.RowAnimationStyle.UP
        });
    }
    loadedNodesCounter = 0;
    Ti.API.info("Triggered refresh events.");
    footer.children[1].text = "Updated " + getCurrentDateTime();
    addBatchRows();
});

var footer = createFooter(win);

table = Ti.UI.createTableView({
	data : rows,
	style : Titanium.UI.iPhone.TableViewStyle.PLAIN,
	backgroundColor : 'transparent',
    footerView: footer
});

table.addEventListener('click', function(e) {
	// if the title of the row is more, we need to fetch more data
	if(e.rowData.title == 'More ...') {
		addBatchRows();
	} else {
		Ti.API.info("Node Type " + e.rowData.type);

		var newwin = Ti.UI.createWindow({
			url : 'health_tip.js',
			title : e.rowData.name,
			backgroundColor : '#ffffff',
			data : e.rowData.data,
			cloudCMSContext : cloudCMSContext
		});
		Ti.UI.currentTab.open(newwin);
	}
});

win.add(table);
addBatchRows();
