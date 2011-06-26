Ti.include("gitana/gitana.js");
// use 10.0.2.2 for android
var win = Ti.UI.currentWindow;
var gitanaContext = win.gitanaContext;

gitanaContext.branch().then(function() {

// create table view data object
    var data = [];

    data[0] = Ti.UI.createTableViewRow({hasDetail:true,title:'Paper'});
    data[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Pens'});
    data[2] = Ti.UI.createTableViewRow({hasDetail:true,title:'Markers'});
    data[3] = Ti.UI.createTableViewRow({hasDetail:true,title:'Clips'});
    data[4] = Ti.UI.createTableViewRow({hasDetail:true,title:'Pads'});
    data[5] = Ti.UI.createTableViewRow({hasDetail:true,title:'Staplers'});
    data[6] = Ti.UI.createTableViewRow({hasDetail:true,title:'Binders'});

// create table view
    var tableview = Titanium.UI.createTableView({
        data:data
    });

// create table view event listener
    tableview.addEventListener('click', function(e) {
        var category = e.rowData.title;
        var categoryWin = Ti.UI.createWindow({
            url: 'products_by_category.js',
            title: 'Category ' + category,
            backgroundColor:'#fff',
            category: category,
            gitanaContext: gitanaContext
        });
        Ti.UI.currentTab.open(categoryWin);
    });

// add table view to the window
    Titanium.UI.currentWindow.add(tableview);

});