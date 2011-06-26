Ti.include("gitana/gitana.js");
Ti.include("product_common.js");

var win = Ti.UI.currentWindow;
var keyword = win.keyword;
var gitanaContext = win.gitanaContext;

var table;
var hasMoreNodes = true;
var batchSize = 3;
var loadedNodesCounter = 0;
var hasMoreRow = null;

var rows = [];

var searchRow = Ti.UI.createTableViewRow({
    height: 'auto'
});
var searchBox = Titanium.UI.createSearchBar({
    hintText : 'Search',
    showCancel:false
});
searchBox.addEventListener('change', function(e) {
    e.value; // search string as user types
});
searchBox.addEventListener('return', function(e) {
    searchBox.blur();
    keyword = e.value;
    for (var index = 1 ; index <= loadedNodesCounter ; index++ ) {
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

/*
var createHasMoreRow = function() {
    hasMoreRow = Ti.UI.createTableViewRow({
        height: 'auto',
        title: 'More ...'
    });
    table.appendRow(hasMoreRow);
};

var deleteHasMoreRow = function() {
    if (hasMoreRow != null) {
        var index = loadedNodesCounter+1;
        try {
            table.deleteRow(index, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
            hasMoreRow = null;
        } catch (E) {
            Ti.UI.createNotification({ message: E.message }).show();
        }
    }
};
*/
var addBatchRows = function () {
    gitanaContext.branch().searchNodes(keyword).filter(function(){
        return (this.get('_type') == 'theoffice:product');
    }).count(function(count) {
        if (count < batchSize) {
            hasMoreNodes = false;
        }
    }).each(function(key, node, index) {
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
            table.insertRowAfter(loadedNodesCounter, row);
        }
        loadedNodesCounter ++;
    }).then(function() {
        /*
        if (!hasMoreNodes) {
            deleteHasMoreRow();
        } else {
            if (hasMoreRow == null) {
                createHasMoreRow();
            }
        }
        */
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
        /*addBatchRows();*/
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
