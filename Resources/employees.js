Ti.include("gitana/gitana.js");
// use 10.0.2.2 for android
var win = Ti.UI.currentWindow;
var gitanaContext = win.gitanaContext;
var rows = [];
var preChar = '';

gitanaContext.branch().getServer().listUsers({"sort":{"lastName": 1}}).filter(function() {
    return (this.getCompanyName() == 'Dunder Mifflin Paper Company, Inc.');
}).each(function(key, user, index) {
    var fullName = user.getLastName() + ',' + user.getFirstName();
    var userId = user.getId();
    Ti.API.info("User: " + userId + " name:" + fullName);
    var row = {title:fullName, hasDetail:true, userId:userId};
    var currentChar = fullName.charAt(0);
    if ( fullName.charAt(0) != preChar) {
        row.header = fullName.charAt(0);
        preChar = currentChar;
    }
    rows.push(row);
}).then(function() {
    var table = Ti.UI.createTableView({
        data: rows,
        style:Titanium.UI.iPhone.TableViewStyle.PLAIN,
        backgroundColor:'transparent'
    });

    table.addEventListener('click', function(e) {
        var employeeWin = Ti.UI.createWindow({
            url: 'employee.js',
            title: e.rowData.title,
            userId: e.rowData.userId,
            backgroundColor:'#aebcad',
            gitanaContext: gitanaContext
        });
        Ti.UI.currentTab.open(employeeWin);
    });
    win.add(table);
});
