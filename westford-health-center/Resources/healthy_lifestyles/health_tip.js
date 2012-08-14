/**
 * Displays individual health tip with a language bar.
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

	var bodyDetailsRow = createNodeBodyView(rows, node);

	var row = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : ''
	});

	var translationLocales = ['en_us'];
	var translationLabels = ['English'];
	var currentLocale = 'en_us';

	var translations = {
		'en_us' : this.object
	}

	var localeLabelMappings = {
		'zh_cn' : '中文',
		"es_es" : 'español'
	};

	this.locales("main", function(locales) {
		for(var i = 0; i < locales.length; i++) {
			var locale = locales[i];
			translationLocales.push(locale);
			if(localeLabelMappings[locale]) {
				translationLabels.push(localeLabelMappings[locale]);
			} else {
				translationLabels.push(locale);
			}
		}
	});

	this.then(function() {
		var buttonBar = Titanium.UI.createButtonBar({
			labels : translationLabels,
			backgroundColor : 'maroon',
			style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
			top : 5,
			left : 5,
			right : 5,
			bottom : 5,
			height : 40
		});

		var updateNodeView = function(translation) {
			win.title = translation['title'];
			tableview.headerTitle = translation['title'];
			var bodyDetails = translation['body'];
            bodyDetailsRow.children[0].text = translation['teaser'];
			var count = 1;
			for(var index = 0; index < bodyDetails.length; index++) {
				var item = bodyDetails[index];
				if(item.subTitle) {
					bodyDetailsRow.children[count++].text = item.subTitle;
				}
				if(item.page) {
					var bodyDetails = translation['body'];
					bodyDetailsRow.children[count++].text = item.page;
				}
			}
		};

		buttonBar.addEventListener('click', function(e) {
			var index = e.index;
			var selectedLocale = translationLocales[index];
			if(selectedLocale != currentLocale) {
				if(translations[selectedLocale]) {
					updateNodeView(translations[selectedLocale]);
				} else {
					node.readTranslation('main', translationLocales[index]).then(function() {
						translations[selectedLocale] = this.object;
						updateNodeView(translations[selectedLocale]);
					});
				}
				currentLocale = selectedLocale;
			}
		});

		row.add(buttonBar);

		rows.push(row);
		tableview = prepareItemTableView(node);
		win.add(tableview);
	});
});
