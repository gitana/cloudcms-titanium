Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");

var rows = [];
var preChar = '';

Chain(whcDomain).listUsers({"sort":{"lastName": 1}}).each(function(key, user, index) {
    var fullName = user.getLastName() + ',' + user.getFirstName();
    var userId = user.getId();
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
            backgroundColor:'#ffffff',
            cloudCMSContext: cloudCMSContext,
            whcDomain: whcDomain
        });
        Ti.UI.currentTab.open(employeeWin);
    });
    win.add(table);
});
