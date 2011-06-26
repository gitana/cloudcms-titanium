Ti.include("gitana/gitana.js");
Ti.include("product_common.js");
// use 10.0.2.2 for android
var win = Ti.UI.currentWindow;
var gitanaContext = win.gitanaContext;
var category = win.category;

var rows = [];

var table;
var hasMoreNodes = true;
var batchSize = 3;
var loadedNodesCounter = 0;
var hasMoreRow = null;

var createHasMoreRow = function() {
    hasMoreRow = Ti.UI.createTableViewRow({
        height: 'auto',
        title: 'More ...'
    });
    table.appendRow(hasMoreRow);
};

var deleteHasMoreRow = function() {
    if (hasMoreRow != null) {
        var index = loadedNodesCounter;
        try {
            table.deleteRow(index, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
            hasMoreRow = null;
        } catch (E) {
            Ti.UI.createNotification({ message: E.message }).show();
        }
    }
};

var addBatchRows = function () {
    Ti.API.info("Running..query... "+category);
    gitanaContext.branch().queryNodes({
        '_type':"theoffice:product",
        "categories" : category
    }, {
        "skip":loadedNodesCounter,
        "limit":batchSize
    }).count(function(count) {
        Ti.API.info("Running..count... ");
        if (count < batchSize) {
            hasMoreNodes = false;
        }
    }).each(function(key, node, index) {
        Ti.API.info("Running..each...");
        var imageUrl = node.attachment('full').getDownloadUri();
        var thumbnailUrl = node.attachment('thumbnail').getDownloadUri();
        Ti.API.info("image " + thumbnailUrl);

        var row = createProductListItemView({
            thumbnailUrl : thumbnailUrl,
            product: node.get('product'),
            id: node.getId(),
            details: node.get('details')
        });

        if (loadedNodesCounter == 0) {
            table.appendRow(row);
        } else {
            table.insertRowAfter(loadedNodesCounter-1, row);
        }
        loadedNodesCounter ++;
    }).then(function() {
        if (!hasMoreNodes) {
            deleteHasMoreRow();
        } else {
            if (hasMoreRow == null) {
                createHasMoreRow();
            }
        }
    });
};

table = Ti.UI.createTableView({
    data: rows,
    style:Titanium.UI.iPhone.TableViewStyle.PLAIN,
	backgroundColor:'transparent'
});

table.addEventListener('click', function(e) {
    // if the title of the row is more, we need to fetch more data
    if (e.rowData.title == 'More ...') {
        addBatchRows();
    }
    else {
        var newwin = Ti.UI.createWindow({
            url: 'product.js',
            title: e.rowData.name,
            backgroundColor:'#aebcad',
            data: e.rowData.data,
            gitanaContext: gitanaContext
        });
        Ti.UI.currentTab.open(newwin);
    }
});

win.add(table);
addBatchRows();
