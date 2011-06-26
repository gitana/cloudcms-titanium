var win = Ti.UI.currentWindow;
var rows = [];

if (Ti.Platform.name == 'android') {
    Titanium.UI.currentWindow.backgroundColor = '#4e5c4d';
}
else {
    Titanium.UI.currentWindow.backgroundColor = '#aebcad';
}

var aboutUsLabel = Ti.UI.createLabel({
    text: 'The only Content Repository built from the ground up on top of MongoDB. Everything you need to introduce enterprise and social content management functionality into your applications.',
    color: '#420404',
    shadowColor:'#FFFFE6',
    textAlign:'left',
    shadowOffset:{x:0,y:1},
    font:{fontSize:13},
    height: 'auto',
    width: 'auto',
    top: 10,
    left:10,
    bottom:10
});

var aboutUsRow = Ti.UI.createTableViewRow({
    height: 'auto',
    header:'About Us'
});

aboutUsRow.add(aboutUsLabel);

rows.push(aboutUsRow);

var websiteLinkRow = Ti.UI.createTableViewRow({hasDetail:true,title:'Web Site',header:'Links',url:'http://www.gitanasoft.com'});

rows.push(websiteLinkRow);

var wikiLinkRow = Ti.UI.createTableViewRow({hasDetail:true,title:'Wiki'});

rows.push(wikiLinkRow);

// create table view
var tableViewOptions = {
    data:rows,
    style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
    headerTitle: 'Cloud CMS - NoSQL Content Management as a Service',
    backgroundColor:'transparent',
    rowBackgroundColor:'white'
};

var tableview = Titanium.UI.createTableView(tableViewOptions);

// create table view event listener
tableview.addEventListener('click', function(e) {
    if (e.rowData.url) {
        Titanium.Platform.openURL(e.rowData.url);
    }
});

win.add(tableview);
