Ti.include("gitana/gitana.js");
Ti.include("product_common.js");
// use 10.0.2.2 for android
var win = Ti.UI.currentWindow;
var android = Ti.Platform.name == 'android';
var gitanaContext = win.gitanaContext;
var personNode;
var nodeId = win.data;
var tableview;
var reviewsIndex;
var rows = [];

if (Ti.Platform.name == 'android') {
    Titanium.UI.currentWindow.backgroundColor = '#4e5c4d';
}
else {
    Titanium.UI.currentWindow.backgroundColor = '#aebcad';
}

var getHelpfulStats = function (commentNode) {
    var helpfulCounter = 0;
    var unhelpfulCounter = 0;
    if (commentNode.object['stats']) {
        if (commentNode.object['stats']['a:deems_helpful']) {
            helpfulCounter = commentNode.object['stats']['a:deems_helpful'];
        }
        if (commentNode.object['stats']['a:deems_unhelpful']) {
            unhelpfulCounter = commentNode.object['stats']['a:deems_unhelpful'];
        }
    }
    return helpfulCounter + ' out of ' + (helpfulCounter + unhelpfulCounter) + ' people found this review helpful.'
};

var getSpamStats = function (commentNode) {
    if (commentNode.object['stats'] && commentNode.object['stats']['a:deems_spam']) {
        return commentNode.object['stats']['a:deems_spam'] + ' people marked this review as inappropriate.';
    } else {
        return '';
    }
};

function createCommentNodeView (commentNode) {

    Ti.API.info("Comment id "+commentNode.getId());
    Ti.API.info("Comment title "+commentNode.get('title'));
    Ti.API.info("Comment description "+commentNode.get('description'));
    Ti.API.info("Comment rating "+commentNode.get('rating'));
    Ti.API.info("Comment rating "+commentNode.get('rating'));
    //Ti.API.info("Comment modified by "+commentNode.getSystemMetadata().getModifiedBy());
    //Ti.API.info("Comment timestamp "+commentNode.getSystemMetadata().getModifiedOn().getTimestamp());


    var row = Ti.UI.createTableViewRow({
        height: 'auto',
        data: commentNode.getId()
    });

    var textView = Ti.UI.createView({
        height:'auto',
        layout:'vertical',
        left:10,
        top:10,
        bottom:30,
        right:10
    });

    var titleLabel = Ti.UI.createLabel({
        text: commentNode.get('title'),
        color: '#420404',
        shadowColor:'#FFFFE6',
        shadowOffset:{x:0,y:1},
        textAlign:'left',
        height:'auto',
        top:10,
        font:{fontWeight:'bold',fontSize:16}
    });

    textView.add(titleLabel);

    var starBarView = Ti.UI.createView({
        height:'auto',
        layout:'horizontal',
        left:0,
        top:5,
        bottom:5,
        right:5
    });

    for (var i = 1 ; i <= commentNode.get('rating') ; i ++) {
        var thumbnailImage = Titanium.UI.createImageView({
            image : "images/icons/star.png",
            width: 16,
            height:16
        });
        starBarView.add(thumbnailImage);
    }

    textView.add(starBarView);

    var userLabel = Ti.UI.createLabel({
        text: commentNode.getSystemMetadata().getModifiedBy()+' @ '+ commentNode.getSystemMetadata().getModifiedOn().getTimestamp(),
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height:'auto',
        top:10
    });
    if (Titanium.Platform.name == 'android') {
        userLabel.right = 30;
    }
    textView.add(userLabel);

    var detailsLabel = Ti.UI.createLabel({
        text: commentNode.get('description'),
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

    var helpfulLabel = Ti.UI.createLabel({
        text: getHelpfulStats(commentNode),
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height:'auto',
        top:10
    });

    textView.add(helpfulLabel);

    var spamLabel = Ti.UI.createLabel({
        text: getSpamStats(commentNode),
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height:'auto',
        top:10
    });

    textView.add(spamLabel);
    row.add(textView);

    if (!android) {
        var buttonBar = Titanium.UI.createButtonBar({
            labels:['Helpful', 'Unhelpful', 'Spam'],
            backgroundColor:'maroon',
            style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
            height:20,
            width:200,
            bottom:2
        });

        buttonBar.addEventListener('click', function(e) {
            var index = e.index;
            if (index == 0) {
                personNode.associate(commentNode, 'a:deems_helpful').then(function() {
                    commentNode.reload().then(function() {
                        helpfulLabel.text = getHelpfulStats(this);
                    });
                });
            }
            if (index == 1) {
                personNode.associate(commentNode, 'a:deems_unhelpful').then(function() {
                    commentNode.reload().then(function() {
                        helpfulLabel.text = getHelpfulStats(this);
                    });
                });
            }
            if (index == 2) {
                personNode.associate(commentNode, 'a:deems_spam').then(function() {
                    commentNode.reload().then(function() {
                        spamLabel.text = getSpamStats(this);
                    });
                });
            }
        });

        row.add(buttonBar);
    } else {

    }

    return row;
}

gitanaContext.branch().readNode(nodeId).then(function() {
    var node = this;
    var fullImageUrl = node.attachment('full').getDownloadUri();
    var name = node.get('product');

    var desc = Ti.UI.createLabel({
        text: node.get('details'),
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height: 'auto',
        width: 'auto',
        top: 5,
        left:5,
        bottom:5
    });

    var descRow = Ti.UI.createTableViewRow({
        height: 'auto',
        header:'Details'
    });

    descRow.add(desc);

    rows.push(descRow);

    var image = Titanium.UI.createImageView({
        image: fullImageUrl,
        width: '100%',
        height: 290,
        top: 5,
        bottom: 5,
        left:5,
        right:5
    });

    var imageRow = Ti.UI.createTableViewRow({
        height: 'auto',
        header:'Photo'
    });

    imageRow.add(image);
    rows.push(imageRow);

    var priceRow = Ti.UI.createTableViewRow({
        height: 'auto',
        header: 'Price'
    });
    var priceLabel = Ti.UI.createLabel({
        text: '$ '+ node.get('price').price +' per '+ node.get('price').unit,
        color: '#420404',
        shadowColor:'#FFFFE6',
        shadowOffset:{x:0,y:1},
        textAlign:'left',
        top:5,
        left:5,
        bottom:5,
        width: 'auto',
        height:'auto',
        font:{fontWeight:'bold',fontSize:16}
    });
    priceRow.add(priceLabel);
    rows.push(priceRow);

    var categories = node.get('categories');
    for (var i = 0 ; i < categories.length ; i++) {
        var rowOptions = {
            height: 'auto',
            title: categories[i],
            hasDetail:true
        };

        if (i == 0) {
            rowOptions.header = 'Categories';
        }

        var categoryRow = Ti.UI.createTableViewRow(rowOptions);
        categoryRow.addEventListener('click', function(e) {
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
        rows.push(categoryRow);
    }

    node.traverse({
        "associations": {
            "theoffice:isRelatedTo": "ANY"
        },
        "depth": 1
    }).nodes().count(function(count){
        Ti.API.info("Total related node " + count);
    }).each(function(key, relatedNode, index) {

        Ti.API.info("Related node " + index);

        var thumbnailUrl = relatedNode.attachment('thumbnail').getDownloadUri();

        var row = createProductListItemView({
            thumbnailUrl : thumbnailUrl,
            product: relatedNode.get('product'),
            id: relatedNode.getId(),
            details: relatedNode.get('details')
        });

        if (index == 0) {
            row.header = 'Related Products';
        }

        row.addEventListener('click', function(e) {
            var newwin = Ti.UI.createWindow({
                url: 'product.js',
                title: e.rowData.name,
                backgroundColor:'#aebcad',
                data: e.rowData.data,
                gitanaContext: gitanaContext
            });
            Ti.UI.currentTab.open(newwin);
        });

        rows.push(row);
    });

    this.then(function() {

        var reviewsRow = Ti.UI.createTableViewRow({
            height: 'auto',
            header: 'User Reviews'
        });

        var reviewButton = Titanium.UI.createButton({
            title:'Write A Review',
            height: android ? 45 : 40
        });

        var buttonView = Ti.UI.createView({
            height:'auto',
            layout:'vertical',
            left:10,
            top:10,
            bottom:10,
            right:10
        });

        buttonView.add(reviewButton);

        reviewsRow.add(buttonView);

        rows.push(reviewsRow);

        var statsRow = Ti.UI.createTableViewRow({
            height: 'auto'
        });

        var statsView = Ti.UI.createView({
            height:'auto',
            layout:'vertical',
            left:10,
            top:10,
            bottom:10,
            right:10
        });

        var averageRating = 0;

        if (node.get('stats') && node.get('stats')['ratingAverageValue']) {
            averageRating = node.get('stats')['ratingAverageValue'];
        }

        var averageRatingLabel = Ti.UI.createLabel({
            text: "Average Rating :: "+Math.round(averageRating*10)/10+" Out Of 5",
            width:'auto',
            height:'auto',
            color: '#420404',
            shadowColor:'#FFFFE6',
            shadowOffset:{x:0,y:1},
            font:{fontWeight:'bold',fontSize:16}
        });
        statsView.add(averageRatingLabel);

        var totalReviews = 0;

        if (node.get('stats') && node.get('stats')['ratingTotalCount']) {
            totalReviews = node.get('stats')['ratingTotalCount'];
        }

        var totalReviewsLabel = Ti.UI.createLabel({
            text: "Total Reviews :: "+totalReviews,
            width:'auto',
            height:'auto',
            color: '#420404',
            shadowColor:'#FFFFE6',
            shadowOffset:{x:0,y:1},
            font:{fontWeight:'bold',fontSize:16}
        });
        statsView.add(totalReviewsLabel);

        statsRow.add(statsView);

        rows.push(statsRow);

        reviewButton.addEventListener('click', function() {
            var newReviewWin = Titanium.UI.createWindow({
                title:'New Review',
                backgroundColor:'#aebcad',
                gitanaContext: gitanaContext
            });

            var reviewFormRows = [];

            var reviewTitleRow = Ti.UI.createTableViewRow({
                height: 'auto',
                header: 'Review Title'
            });

            var reviewTitleField = Ti.UI.createTextField({
                autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                height: android ? 45 : 35,
                borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
                hintText:'Review Title'
            });
            reviewTitleRow.add(reviewTitleField);
            reviewFormRows.push(reviewTitleRow);

            var reviewDescriptionRow = Ti.UI.createTableViewRow({
                height: 'auto',
                header: 'Your Review'
            });

            var reviewDescriptionField = Titanium.UI.createTextArea({
                height:140,
                textAlign:'left',
                borderWidth:1,
                borderColor:'#bbb',
                borderRadius:5,
                font:{fontSize:14}
            });
            reviewDescriptionRow.add(reviewDescriptionField);
            reviewFormRows.push(reviewDescriptionRow);

            var rateButtonRow = Ti.UI.createTableViewRow({
                height: 'auto',
                header: 'Rating'
            });

            var rateButton = Titanium.UI.createButton({
                title:'Rate This Product',
                height: android ? 45 : 40
            });
            rateButtonRow.add(rateButton);
            reviewFormRows.push(rateButtonRow);
            var dataMapping = {
                'Horrible':4,
                'Mediocre':3,
                'Ok':2,
                'Good':1,
                'Excellent':0
            };
            var ratingMapping = {
                'Horrible':1,
                'Mediocre':2,
                'Ok':3,
                'Good':4,
                'Excellent':5
            };
            rateButton.addEventListener('click', function() {
                var ratingWin = Titanium.UI.createWindow({
                    title:'Rate Product',
                    backgroundColor:'#aebcad'
                });

                var reviewRatingField = Titanium.UI.createPicker({
                    height: 220
                });
                var data = [];
                data[0] = Titanium.UI.createPickerRow({title:'Excellent'});
                data[1] = Titanium.UI.createPickerRow({title:'Good'});
                data[2] = Titanium.UI.createPickerRow({title:'Ok'});
                data[3] = Titanium.UI.createPickerRow({title:'Mediocre'});
                data[4] = Titanium.UI.createPickerRow({title:'Horrible'});
                reviewRatingField.add(data);
                Titanium.UI.currentTab.open(ratingWin, {animated:true});
                var initSelection;
                if (rateButton.title && dataMapping[rateButton.title]) {
                    initSelection = rateButton.title;
                    reviewRatingField.setSelectedRow(0,dataMapping[rateButton.title],false);
                    Ti.API.info("You selected row: " + dataMapping[rateButton.title]);
                }
                reviewRatingField.selectionIndicator = true;
                ratingWin.add(reviewRatingField);
                reviewRatingField.addEventListener('change', function(e) {
                    if (e.row.title != initSelection) {
                        Ti.API.info("You selected row: " + e.row + ", column: " + e.column + ", title: " + e.row.title);
                        rateButton.title = e.row.title;
                        ratingWin.close();
                    }
                });
            });

            var reviewButtonsRow = Ti.UI.createTableViewRow({
                height: 'auto',
                header: 'Actions'
            });
            var createButton = Titanium.UI.createButton({
                title:'Save Your Review',
                height: android ? 45 : 40
            });
            reviewButtonsRow.add(createButton);

            reviewFormRows.push(reviewButtonsRow);

            createButton.addEventListener('click', function() {
                var reviewTitle = reviewTitleField.value;
                var reviewDescription = reviewDescriptionField.value;
                var rating = ratingMapping[rateButton.title];
                if (reviewTitle && reviewDescription && rating) {
                    // Do the actual work
                    var reviewVal = {
                        "title" : reviewTitle,
                        "description" : reviewDescription,
                        "rating": rating,
                        "_type" : "n:comment"
                    };
                    gitanaContext.branch().createNode(reviewVal).then(function() {
                        var commentNode = this;
                        this.reload().associateOf(node, "a:has_comment").then(function(status) {
                            this.subchain(node).reload().then(function() {
                                averageRatingLabel.text = "Average Rating :: "+Math.round(this.get('stats')['ratingAverageValue']*10)/10+" Out Of 5";
                                totalReviewsLabel.text = "Total Reviews :: "+this.get('stats')['ratingTotalCount'];
                                Ti.API.info("reviewsIndex...."+reviewsIndex);
                                tableview.insertRowAfter(reviewsIndex-1,createCommentNodeView (commentNode),{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN});
                                newReviewWin.close();
                            });
                        });
                    });
                }
            });

            var reviewFormView = Ti.UI.createTableView({
                data:reviewFormRows,
                style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
                backgroundColor:'transparent'
            });

            newReviewWin.add(reviewFormView);

            Titanium.UI.currentTab.open(newReviewWin, {animated:true});
        });

        var currentUserId = gitanaContext.getDriver().authenticatedUsername;

        this.subchain(node.getBranch()).readPerson(currentUserId).then(function() {
            personNode = this;
        });

        reviewsIndex = rows.length;
        // generate review list
        this.subchain(node).outgoingAssociations("a:has_comment", {
            "sort": {
                'timestamp.ms': -1
            }
        }).each(function(key, associationNode, index) {
            associationNode.readTargetNode().then(function() {
                var commentNode = this;
                rows.push(createCommentNodeView (commentNode));
                Ti.API.info("Comment " + index);
            });
        });

        this.then(function() {
            Ti.API.info("Prepare table view....");

            // create table view
            var tableViewOptions = {
                data:rows,
                style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
                headerTitle: name,
                backgroundColor:'transparent',
                rowBackgroundColor:'white'
            };

            tableview = Titanium.UI.createTableView(tableViewOptions);

            // create table view event listener
            tableview.addEventListener('click', function(e) {
                if (e.rowData.test) {
                    var win = Titanium.UI.createWindow({
                        url:e.rowData.test,
                        title:e.rowData.title
                    });
                    Titanium.UI.currentTab.open(win, {animated:true});
                }
            });

            win.add(tableview);
        });
    });
});