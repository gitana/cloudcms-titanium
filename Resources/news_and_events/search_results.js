/**
 *  Returns search results based on content type and keyword.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");
Ti.include("../common/content_common.js");

var keyword = win.keyword;

var table;
var hasMoreNodes = true;
var batchSize = 3;
var loadedNodesCounter = 0;
var hasMoreRow = null;

var rows = [];

var searchRow = Ti.UI.createTableViewRow({
	height : Ti.UI.SIZE
});

var searchBox = Titanium.UI.createSearchBar({
	hintText : 'Search',
	showCancel : false
});

searchBox.addEventListener('change', function(e) {
	e.value // search string as user types
});

searchBox.addEventListener('return', function(e) {
	searchBox.blur();
	keyword = e.value;
	for(var index = 1; index <= loadedNodesCounter; index++) {
		table.deleteRow(1);
	}
	loadedNodesCounter = 0;
	addBatchRows();
});

searchBox.addEventListener('cancel', function(e) {
	searchBox.blur();
});

searchBox.addEventListener('focus', function(e) {
	searchBox.showCancel = true;
});

searchBox.addEventListener('blur', function(e) {
	searchBox.showCancel = false;
});

searchRow.add(searchBox);

rows.push(searchRow);

var createHasMoreRow = function() {
	hasMoreRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
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
	cloudCMSContext.branch().find({
		"search" : keyword,
		"query" : {
			"_type" : {
				"$in" : ['whc:event', 'whc:news']
			}
		}
	}, {
		"skip" : loadedNodesCounter,
		"limit" : batchSize
	}).count(function(count) {
        if (count < batchSize) {
            hasMoreNodes = false;
        }
    }).each(function(key, node, index) {
        var thumbnailUrl;
        this.listAttachments(true).then(function() {
            if (this.map["thumb"]) {
                this.select("thumb").then(function() {
                    thumbnailUrl = this.getDownloadUri();
                });
            } else if (this.map["default"]) {
                this.select("thumb").then(function() {
                    thumbnailUrl = this.getDownloadUri();
                });
            }
        });

        this.then(function() {
            var row = createListItemView({
				id : node.getId(),
				type : node.getTypeQName(),
				title : node.get('title'),
				thumbnailUrl : thumbnailUrl,
				details : node.get('teaser')
			});
            if (loadedNodesCounter == 0) {
                table.appendRow(row);
            } else {
                table.insertRowAfter(loadedNodesCounter, row);
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

table = Ti.UI.createTableView({
	data : rows,
	style : Titanium.UI.iPhone.TableViewStyle.PLAIN,
	backgroundColor : 'transparent'
});

table.addEventListener('click', function(e) {
	// if the title of the row is more, we need to fetch more data
	if(e.rowData.title == 'More ...') {
		addBatchRows();
	} else {
		var itemJs = e.rowData.type == "whc:event" ? "event.js" : "news.js";

		var newwin = Ti.UI.createWindow({
			url : itemJs,
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
