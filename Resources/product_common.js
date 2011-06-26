var createProductListItemView = function (configs) {
    var thumbnailImage = Titanium.UI.createImageView({
        image : configs.thumbnailUrl,
        width: 80,
        left: 5
    });

    var row = Ti.UI.createTableViewRow({
        height: 'auto',
        name :  configs.product,
        data: configs.id
    });

    row.add(thumbnailImage);

    var textView = Ti.UI.createView({
        height:'auto',
        layout:'vertical',
        left:85,
        top:10,
        bottom:10,
        right:10
    });

    var productLabel = Ti.UI.createLabel({
        text: configs.product,
        color: '#420404',
        shadowColor:'#FFFFE6',
        shadowOffset:{x:0,y:1},
        textAlign:'left',
        height:'auto',
        top:10,
        font:{fontWeight:'bold',fontSize:16}
    });
    if (Titanium.Platform.name == 'android') {
        productLabel.top = 10;
    }
    textView.add(productLabel);

    var detailsLabel = Ti.UI.createLabel({
        text: configs.details,
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height:'auto',
        top:10
    });
    if (Titanium.Platform.name == 'android') {
        detailsLabel.right = 30;
    }
    textView.add(detailsLabel);

    row.add(textView);

    return row;
};