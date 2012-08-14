/**
 * Common content related utility functions.
 */
var tableview;

/**
 * Creates list item view.
 *
 * @param configs
 */
var createListItemView = function(configs) {
	var thumbnailImage = Titanium.UI.createImageView({
		image : configs.thumbnailUrl,
		width : 80,
		height : 120,
		top : 20,
		left : 5
	});

	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		name : configs.title,
		type : configs.type,
		data : configs.id
	});

	row.add(thumbnailImage);

	var textView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : 90,
		top : 10,
		bottom : 10,
		right : 10
	});

	var titleLabel = Ti.UI.createLabel({
		text : configs.title,
		color : '#000000',
		shadowColor : '#FFFFE6',
		shadowOffset : {
			x : 0,
			y : 1
		},
		//textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		height : Ti.UI.SIZE,
        left : 5,
		top : 10,
		font : {
			fontWeight : 'bold',
			fontSize : 16
		}
	});
	if(Titanium.Platform.name == 'android') {
		titleLabel.top = 10;
	}
	textView.add(titleLabel);

	var detailsLabel = Ti.UI.createLabel({
		text : configs.details,
		color : '#000000',
		shadowColor : '#FFFFE6',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : Ti.UI.SIZE,
		top : 10,
        bottom : 20
	});

    if(Titanium.Platform.name == 'android') {
		detailsLabel.right = 30;
	}

    textView.add(detailsLabel);

	row.add(textView);

	return row;
};

/**
 * Returns stats for helpful and unhelpful.
 *
 * @param commentNode
 */
var getHelpfulStats = function(commentNode) {
	var helpfulCounter = 0;
	var unhelpfulCounter = 0;
	if(commentNode.object['stats']) {
		if(commentNode.object['stats']['a:deems_helpful']) {
			helpfulCounter = commentNode.object['stats']['a:deems_helpful'];
		}
		if(commentNode.object['stats']['a:deems_unhelpful']) {
			unhelpfulCounter = commentNode.object['stats']['a:deems_unhelpful'];
		}
	}
	return helpfulCounter + '/' + (helpfulCounter + unhelpfulCounter) + ' people found this comment helpful.'
};

/**
 * Returns stats for spam.
 *
 * @param commentNode
 */
var getSpamStats = function(commentNode) {
	if(commentNode.object['stats'] && commentNode.object['stats']['a:deems_spam']) {
		return commentNode.object['stats']['a:deems_spam'] + ' people marked this comment as spam.';
	} else {
		return '0 people marked this comment as spam.';
	}
};

/**
 * Displays individual node comment and a toolbar for deeming it as helpful, unhelpful or spam.
 *
 * @param commentNode
 */
var createCommentNodeView = function(commentNode) {

	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		data : commentNode.getId()
	});

	var textView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : 10,
		top : 10,
		bottom : 30,
		right : 10
	});

	var titleLabel = Ti.UI.createLabel({
		text : commentNode.get('title'),
		color : '#000000',
		shadowColor : '#FFFFE6',
		shadowOffset : {
			x : 0,
			y : 1
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		height : Ti.UI.SIZE,
		top : 10,
		font : {
			fontWeight : 'bold',
			fontSize : 16
		},
        left : 5
	});

	textView.add(titleLabel);

	var starBarView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'horizontal',
		left : 5,
		top : 5,
		bottom : 5,
		right : 5
	});

	for(var i = 1; i <= commentNode.get('rating'); i++) {
		var thumbnailImage = Titanium.UI.createImageView({
			image : "../images/icons/star.png",
			width : 16,
			height : 16
		});
		starBarView.add(thumbnailImage);
	}

	textView.add(starBarView);

	var userLabel = Ti.UI.createLabel({
		text : commentNode.getSystemMetadata().getModifiedBy() + ' @ ' + commentNode.getSystemMetadata().getModifiedOn().getTimestamp(),
		color : '#000000',
		shadowColor : '#FFFFE6',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : Ti.UI.SIZE,
		top : 10,
        left : 5
	});
	if(Titanium.Platform.name == 'android') {
		userLabel.right = 30;
	}
	textView.add(userLabel);

	var detailsLabel = Ti.UI.createLabel({
		text : commentNode.get('description'),
		color : '#000000',
		shadowColor : '#FFFFE6',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : Ti.UI.SIZE,
		top : 10,
        left : 5
	});
	if(Titanium.Platform.name == 'android') {
		detailsLabel.right = 30;
	}
	textView.add(detailsLabel);

	var helpfulLabel = Ti.UI.createLabel({
		text : getHelpfulStats(commentNode),
		color : '#000000',
		shadowColor : '#FFFFE6',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : Ti.UI.SIZE,
		top : 15,
        left : 5,
        bottom : 0
	});

	textView.add(helpfulLabel);

	var spamLabel = Ti.UI.createLabel({
		text : getSpamStats(commentNode),
		color : '#000000',
		shadowColor : '#FFFFE6',
		//textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : Ti.UI.SIZE,
		top : 5,
        left : 5,
        bottom : 5
	});

	textView.add(spamLabel);
	row.add(textView);

	if(!android) {
		var buttonBar = Titanium.UI.createButtonBar({
			labels : ['Helpful', 'Unhelpful', 'Spam'],
			backgroundColor : 'maroon',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
			height : 20,
			width : 200,
			bottom : 2
		});

		buttonBar.addEventListener('click', function(e) {
			var index = e.index;
			if(index == 0) {
				personNode.associate(commentNode, 'a:deems_helpful').then(function() {
					commentNode.reload().then(function() {
						helpfulLabel.text = getHelpfulStats(this);
					});
				});
			}
			if(index == 1) {
				personNode.associate(commentNode, 'a:deems_unhelpful').then(function() {
					commentNode.reload().then(function() {
						helpfulLabel.text = getHelpfulStats(this);
					});
				});
			}
			if(index == 2) {
				personNode.associate(commentNode, 'a:deems_spam').then(function() {
					commentNode.reload().then(function() {
						spamLabel.text = getSpamStats(this);
					});
				});
			}
		});

		row.add(buttonBar);
	} else {
        //TODO: Add an appropriate toolbar for android.
	}

	return row;
};

/**
 * Displays list of node comments.
 *
 * @param rows
 * @param thisNode
 */
var createNodeCommentsView = function(rows, thisNode) {

	var reviewsRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : ''
	});

	var reviewButton = Titanium.UI.createButton({
		title : 'Leave Your Comment',
		height : android ? 45 : 40,
        width : '100%'
	});

    var reviewButtonImageView = Ti.UI.createImageView({
        image:'../images/icons/comment.png',
        left:10,
        height:33,
        width:33
    });
    reviewButton.add(reviewButtonImageView);

    var buttonView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});

	buttonView.add(reviewButton);

	reviewsRow.add(buttonView);

	rows.push(reviewsRow);

	var statsRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : 'Comments'
	});

	var statsView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		layout : 'vertical',
		left : 10,
		top : 10,
		bottom : 10,
		right : 10
	});

	var averageRating = 0;

	var statsText = ""

	if(thisNode.get('stats') && thisNode.get('stats')['ratingAverageValue']) {
		averageRating = thisNode.get('stats')['ratingAverageValue'];
	}

	statsText = "Rated " + Math.round(averageRating * 10) / 10 + "/5";

	var totalReviews = 0;

	if(thisNode.get('stats') && thisNode.get('stats')['ratingTotalCount']) {
		totalReviews = thisNode.get('stats')['ratingTotalCount'];
	}

	statsText += ' based on ' + totalReviews + ' reviews.';

	var statsLabel = Ti.UI.createLabel({
		text : statsText,
		width : 'auto',
		height : Ti.UI.SIZE,
		color : '#000000',
		shadowColor : '#FFFFE6',
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontWeight : 'bold',
			fontSize : 16
		}
	});

	statsView.add(statsLabel);

	statsRow.add(statsView);

	rows.push(statsRow);

	reviewButton.addEventListener('click', function() {
		var newReviewWin = Titanium.UI.createWindow({
			title : 'New Comment',
			backgroundColor : '#ffffff',
			cloudCMSContext : cloudCMSContext
		});

		var reviewFormRows = [];

		var reviewTitleRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Title'
		});

		var reviewTitleField = Ti.UI.createTextField({
			autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
			height : android ? 45 : 35,
			borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
            width : '100%',
			hintText : 'Title'
		});
		reviewTitleRow.add(reviewTitleField);
		reviewFormRows.push(reviewTitleRow);

		var reviewDescriptionRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Your Comment'
		});

		var reviewDescriptionField = Titanium.UI.createTextArea({
			height : 140,
            width : '100%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			borderWidth : 1,
			borderColor : '#bbb',
			borderRadius : 5,
			font : {
				fontSize : 14
			}
		});
		reviewDescriptionRow.add(reviewDescriptionField);
		reviewFormRows.push(reviewDescriptionRow);

		var rateButtonRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Rating'
		});

		var rateButton = Titanium.UI.createButton({
			title : 'Rate This Item',
			height : android ? 45 : 40,
            width : '100%'
		});
		rateButtonRow.add(rateButton);
		reviewFormRows.push(rateButtonRow);
		var dataMapping = {
			'Horrible' : 4,
			'Mediocre' : 3,
			'Ok' : 2,
			'Good' : 1,
			'Excellent' : 0
		};
		var ratingMapping = {
			'Horrible' : 1,
			'Mediocre' : 2,
			'Ok' : 3,
			'Good' : 4,
			'Excellent' : 5
		};

        var onRateButtonClick = function() {
			var ratingWin = Titanium.UI.createWindow({
				title : 'Rate Item',
				backgroundColor : '#ffffff',
                width : '100%'
			});

			var reviewRatingField = Titanium.UI.createPicker({
				height : 220
			});
			var data = [];
			data[0] = Titanium.UI.createPickerRow({
				title : 'Excellent'
			});
			data[1] = Titanium.UI.createPickerRow({
				title : 'Good'
			});
			data[2] = Titanium.UI.createPickerRow({
				title : 'Ok'
			});
			data[3] = Titanium.UI.createPickerRow({
				title : 'Mediocre'
			});
			data[4] = Titanium.UI.createPickerRow({
				title : 'Horrible'
			});
			reviewRatingField.add(data);

			Titanium.UI.currentTab.open(ratingWin, {
				animated : true
			});

			var initSelection;
			if(rateButton.title && dataMapping[rateButton.title]) {
				initSelection = rateButton.title;
				reviewRatingField.setSelectedRow(0, dataMapping[rateButton.title], false);
			}
			reviewRatingField.selectionIndicator = true;
			ratingWin.add(reviewRatingField);
			reviewRatingField.addEventListener('change', function(e) {
				if(e.row.title != initSelection) {
					rateButton.title = e.row.title;
					ratingWin.close();
				}
                //rateButton.addEventListener('click', onRateButtonClick);
                //createButton.addEventListener('click', onCreateButtonClick);
			});
		};

		rateButton.addEventListener('click', onRateButtonClick);

		var reviewButtonsRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Actions'
		});
		var reviewCreateButton = Titanium.UI.createButton({
			title : 'Post Your Comment',
			height : android ? 45 : 40,
            width : '100%'
		});
        var createButtonImageView = Ti.UI.createImageView({
            image:'../images/icons/comment-save.png',
            left:10,
            height:33,
            width:33
        });
        reviewCreateButton.add(createButtonImageView);

		var onCreateButtonClick = function(e) {
			Ti.API.info("Real Button clicked" + e.source.toString());

            var reviewTitle = reviewTitleField.value;
			var reviewDescription = reviewDescriptionField.value;
			var rating = ratingMapping[rateButton.title];

			if(reviewTitle && reviewDescription && rating) {
				// Do the actual work
				var reviewVal = {
					"title" : reviewTitle,
					"description" : reviewDescription,
					"rating" : rating,
					"_type" : "n:comment"
				};
				cloudCMSContext.branch().createNode(reviewVal).then(function() {
					var commentNode = this;
					this.reload().associateOf(thisNode, "a:has_comment").then(function(status) {
						this.subchain(thisNode).reload().then(function() {
							statsLabel.text = "Rated " + Math.round(this.get('stats')['ratingAverageValue'] * 10) / 10 + "/5" + ' based on ' + this.get('stats')['ratingTotalCount'] + ' reviews.';
							tableview.insertRowAfter(reviewsIndex - 1, createCommentNodeView(commentNode), {
								animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN
							});
							newReviewWin.close();
						});
					});
				});
			}
		}

        //reviewCreateButton.addEventListener('click', onCreateButtonClick);

        reviewButtonsRow.add(reviewCreateButton);

		reviewFormRows.push(reviewButtonsRow);

		var reviewFormView = Ti.UI.createTableView({
			data : reviewFormRows,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor : 'transparent'
		});

        reviewFormView.addEventListener('click', function(e) {
			Ti.API.info(e.source.toString());
            var clickedButton = e.source;
            if (clickedButton.toString() == '[object TiUIButton]') {
                var buttonTitle = clickedButton.title;
                Ti.API.info(buttonTitle);
                if (buttonTitle == 'Post Your Comment') {
                    onCreateButtonClick(e);
                }
            }
        });

        newReviewWin.add(reviewFormView);

		Titanium.UI.currentTab.open(newReviewWin, {
			animated : true
		});
	});

	var authInfo = cloudCMSContext.getDriver().getAuthInfo();
	var currentUserId = authInfo.getPrincipalDomainId() + "/" + authInfo.getPrincipalId();

	thisNode.subchain(thisNode.getBranch()).readPersonNode(currentUserId).then(function() {
		personNode = this;
	});

	reviewsIndex = rows.length;
	// generate review list
	thisNode.subchain(thisNode).outgoingAssociations("a:has_comment", {
		"sort" : {
			'timestamp.ms' : -1
		}
	}).each(function(key, associationNode, index) {
		associationNode.readTargetNode().then(function() {
			var commentNode = this;
			rows.push(createCommentNodeView(commentNode));
		});
	});
}

/**
 * Creates common node view (teaser,full image)
 *
 * @param rows
 * @param node
 */
var createNodeCommonView = function(rows, node) {
	var fullImageUrl = node.attachment('default').getDownloadUri();

	var image = Titanium.UI.createImageView({
		image : fullImageUrl,
		width : '100%',
		height : 290,
		top : 5,
		bottom : 5,
		left : 5,
		right : 5
	});

	var imageRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : ''
	});

	imageRow.add(image);
	rows.push(imageRow);
}

/**
 * Creates node body view (sub title and page)
 *
 * @param rows
 * @param node
 */
var createNodeBodyView = function(rows, node) {
	var bodyDetails = node.get('body');
	var defaultWidth = Ti.Platform.displayCaps.platformWidth - 30;
    var bodyDetailsRow;
    
	if(bodyDetails) {
		bodyDetailsRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			layout : 'vertical',
			width : defaultWidth,
			header : '',
			left : 10,
			top : 5
		});
		var height = 0;

        var descLabel = Ti.UI.createLabel({
            text : node.get('teaser'),
            color : '#000000',
            shadowColor : '#FFFFE6',
            textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
            shadowOffset : {
                x : 0,
                y : 1
            },
            font : {
                fontSize : 13
            },
            height : Ti.UI.SIZE,
            width : defaultWidth,
            top : 5,
            left : 10,
            //bottom : 5,
            right : 5
        });

        bodyDetailsRow.add(descLabel);
        //height += descLabel.size.height + 10;

		for(var index = 0; index < bodyDetails.length; index++) {
			var item = bodyDetails[index];
			var itemText = "";
			if(item.subTitle) {
				var subTitleLabel = Ti.UI.createLabel({
					text : item.subTitle,
					color : '#000000',
					shadowColor : '#FFFFE6',
					shadowOffset : {
						x : 0,
						y : 1
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
					height : Ti.UI.SIZE,
					width : defaultWidth,
					top : 5,
					left : 10,
					font : {
						fontWeight : 'bold',
						fontSize : 16
					}
				});

				bodyDetailsRow.add(subTitleLabel);
				//height += subTitleLabel.size.height + 10;
			}

			if(item.page) {
				var pageLabel = Ti.UI.createLabel({
					text : item.page,
					color : '#000000',
					shadowColor : '#FFFFE6',
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
					shadowOffset : {
						x : 0,
						y : 1
					},
					font : {
						fontSize : 13
					},
					top : 5,
                    left : 10/*,
					height : Ti.UI.SIZE,
					width : defaultWidth,
					top : 5,
					left : 10,
					bottom : 5,
					right : 5*/
				});

				bodyDetailsRow.add(pageLabel);
				//height += pageLabel.size.height + 10;

			}
		}
		//bodyDetailsRow.height = height;
		rows.push(bodyDetailsRow);
	}
	return bodyDetailsRow;
}

/**
 * Displays list of related nodes.
 *
 * @param rows
 * @param node
 */
var createRelatedNodesView = function(rows, node) {
	var relatedNodesRow;

	node.subchain(node.getBranch()).queryNodes({
		"tags" : {
			"$in" : node.get('tags')
		},
		"_type" : {
			"$in" : ['whc:news', 'whc:event']
		},
		"_doc" : {
			"$ne" : node.getId()
		}
	}).count(function(count) {
	}).each(function(key, relatedNode, index) {

		var thumbnailUrl = null;

		this.listAttachments(true).then(function() {
			if(this.map["thumb"]) {
				this.select("thumb").then(function() {
					thumbnailUrl = this.getDownloadUri();
				});
			} else if(this.map["default"]) {
				this.select("thumb").then(function() {
					thumbnailUrl = this.getDownloadUri();
				});
			}
		});

		this.then(function() {
			var row = createListItemView({
				id : relatedNode.getId(),
				type : relatedNode.getTypeQName(),
				title : relatedNode.get('title'),
				thumbnailUrl : thumbnailUrl,
				details : relatedNode.get('teaser')
			});

			if(index == 0) {
				row.header = 'Related';
			}

			rows.push(row);
		});
	});
}

/**
 * Prepares item table view.
 *
 * @param node
 */
var prepareItemTableView = function(node) {
	var title = node.get('title');

    // Custom header row
    var headerLabel = Ti.UI.createLabel({
        width:'100%',
        color: '#000',
        text: title,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
            fontWeight:'bold',
            fontSize:20
        }
    });
    var headerView = Ti.UI.createView({
        backgroundColor: '#fff',
        height: 70,
        width:'100%'
    });
    headerView.add(headerLabel);

	// create table view
	var tableViewOptions = {
		data : rows,
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
		headerView : headerView,
		backgroundColor : 'transparent',
		rowBackgroundColor : 'white'
	};

	tableview = Titanium.UI.createTableView(tableViewOptions);

	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if(e.rowData.type) {
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
	return tableview;
}

/**
 * Gets current datetime string.
 */
var getCurrentDateTime = function() {
    var date = new Date();
    var hour = date.getHours();
    var ap = "AM";
    if (hour > 11) {
        ap = "PM";
    }
    if (hour > 12) {
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hour + ":" + date.getMinutes() + " " + ap;
};

/**
 *  Creates custom footer with refresh button.
 */
var createFooter = function(win) {
    var footer = Ti.UI.createView({
        height:35,
        backgroundImage:'../images/background/gradientBackground.png'
    });

    var refreshButtonImageView = Ti.UI.createImageView({
        image:'../images/icons/refresh.png',
        top : 5,
        bottom : 5,
        left:5,
        height:25,
        width:25
    });

    var lastUpdatedLabel = Ti.UI.createLabel({
        text : "Updated " + getCurrentDateTime(),
        color : '#ffffff',
        textAlign : 'center',
        height : Ti.UI.SIZE,
        top : 10,
        font : {
            fontWeight : 'bold',
            fontSize : 14
        }
    });

    refreshButtonImageView.addEventListener('click', function(e) {
        win.fireEvent('refresh', {});
    });

    footer.add(refreshButtonImageView);
    footer.add(lastUpdatedLabel);
    return footer;
};

