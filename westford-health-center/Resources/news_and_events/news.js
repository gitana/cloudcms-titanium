/**
 * Displays individual news.
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

	createNodeCommonView(rows, node);

	createNodeBodyView(rows, node);

	createRelatedNodesView(rows, node);

	this.then(function() {

		createNodeCommentsView(rows, this, tableview);

		this.then(function() {
			tableview = prepareItemTableView(node);
			win.add(tableview);
		});
	});
});
