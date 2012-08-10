/**
 * Displays individual event.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");
Ti.include("../common/content_common.js");

var personNode;
var nodeId = win.data;
var reviewsIndex;
var rows = [];

cloudCMSContext.branch().readNode(nodeId).then(function() {
	var node = this;
	var eventDetails = node.get('details');

	if(eventDetails) {
		var eventDetailsRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Event Details',
			layout : 'vertical',
			left : 10,
			top : 5
		});
		for(var index = 0; index < eventDetails.length; index++) {
			var item = eventDetails[index];
			var itemText = "";
			if(item.date) {
				itemText += item.date;
			}
			if(item.time) {
				if(item.time.start) {
					itemText += " " + formatTime(item.time.start);
				}
				if(item.time.end) {
					itemText += "-" + formatTime(item.time.end);
				}
			}
			var itemLabel = Ti.UI.createLabel({
				text : itemText,
				color : '#000000',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				height : Ti.UI.SIZE,
				top : 5,
				left : 10,
				font : {
					fontWeight : 'bold',
					fontSize : 16
				}
			});

			eventDetailsRow.add(itemLabel);

			if(item.location) {
				var locationLabel = Ti.UI.createLabel({
					text : item.location,
					color : '#000000',
					shadowColor : '#FFFFE6',
					shadowOffset : {
						x : 0,
						y : 1
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
					height : Ti.UI.SIZE,
					top : 5,
					left : 10,
					bottom : 10,
					font : {
						fontWeight : 'bold',
						fontSize : 13
					}
				});
				eventDetailsRow.add(locationLabel);
			}
		}

		rows.push(eventDetailsRow);
	}

	createNodeCommonView(rows, node);

	createNodeBodyView(rows, node);

	createRelatedNodesView(rows, node);

	this.then(function() {

		createNodeCommentsView(rows, this);

		this.then(function() {
			tableview = prepareItemTableView(node);
			win.add(tableview);
		});
	});
});
