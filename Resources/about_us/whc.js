/**
 * Displays information of Westford Health Center.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");

var rows = [];

cloudCMSContext.branch().readNode('whc:aboutus').then(function() {
	var node = this;
	var aboutUsLabel = Ti.UI.createLabel({
		text : node.getDescription(),
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
		width : 'auto',
		top : 10,
		left : 10,
		bottom : 10
	});

	var aboutUsRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : 'About Us'
	});

	aboutUsRow.add(aboutUsLabel);

	rows.push(aboutUsRow);

	var photosRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		header : 'Photos'
	});

	//Titanium.App.fireEvent('show_indicator');

	var images = [];
	
	var count = 0;

	this.listAttachments(true).each(function() {
		if(this.getId() && this.getId().indexOf('photo') == 0) {
			images.push(this.getDownloadUri());
		}
	}).then(function() {
		var imageView = Titanium.UI.createImageView({
			image : images[count],
			duration : 100,
			repeatCount : 0,
			width : '100%',
			height : 290,
			top : 5,
			bottom : 5,
			left : 5,
			right : 5
		});

		photosRow.add(imageView);

        var nextButton = Titanium.UI.createButton({
            width:200,
            height:40,
            title : 'Next Photo',
            top : 310,
            bottom : 5
        });

		nextButton.addEventListener('click', function(e) {
			count = count < images.length -1 ? count + 1 : 0;
			imageView.image = images[count];
		});

        var nextButtonImageView = Ti.UI.createImageView({
            image:'../images/icons/camera.png',
            left:10,
            height:33,
            width:33
        });
        nextButton.add(nextButtonImageView);

        photosRow.add(nextButton);

        rows.push(photosRow);
	});

	this.then(function() {
		var hoursRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Office Hours'
		});

		var hoursTextView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'vertical',
			left : 10,
			top : 10,
			bottom : 10,
			right : 10,
			left : 5
		});

		var hours = node.get('hours');

		for(var i = 0; i < hours.length; i++) {
			var dayLabel = Ti.UI.createLabel({
				text : hours[i].day,
				color : '#000000',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				height : Ti.UI.SIZE,
				top : 5,
				font : {
					fontWeight:'bold',
                    fontSize : 16
				},
			    left : 5
			});
            hoursTextView.add(dayLabel);
			var hourLabel = Ti.UI.createLabel({
				text : formatTime(hours[i].time.start) + "-" + formatTime(hours[i].time.end),
				color : '#000000',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				height : Ti.UI.SIZE,
				top : 5,
				font : {
					fontSize : 16
				},
			    left : 5
			});
			hoursTextView.add(hourLabel);
		}

		hoursRow.add(hoursTextView);

		rows.push(hoursRow);

		var contactsRow = Ti.UI.createTableViewRow({
			height : Ti.UI.SIZE,
			header : 'Contacts'
		});

		var textView = Ti.UI.createView({
			height : Ti.UI.SIZE,
			layout : 'vertical',
			left : 10,
			top : 10,
			bottom : 10,
			right : 10,
			left : 5
		});

		var address = node.get('address');

		var street = address['street'];

		for(var i = 0; i < street.length; i++) {
			var addressLabel1 = Ti.UI.createLabel({
				text : street[i],
				color : '#000000',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				height : Ti.UI.SIZE,
				top : 5,
				font : {
					fontWeight : 'bold',
					fontSize : 16
				},
			    left : 5
			});
			textView.add(addressLabel1);
		}

		var addressLabel2 = Ti.UI.createLabel({
			text : address['city'] + ' ' + address['state'] + ' ' + address['zip'],
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			height : Ti.UI.SIZE,
			top : 5,
			font : {
				fontWeight : 'bold',
				fontSize : 16
			},
			left : 5
		});

		textView.add(addressLabel2);

		var phoneLabel = Ti.UI.createLabel({
			text : node.get('phone'),
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			height : Ti.UI.SIZE,
			top : 5,
			font : {
				fontSize : 16
			},
			left : 5
		});

		textView.add(phoneLabel);

		var emailLabel = Ti.UI.createLabel({
			text : node.get('email'),
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			height : Ti.UI.SIZE,
			top : 5,
			font : {
				fontSize : 16
			},
			left : 5
		});

		textView.add(emailLabel);

		contactsRow.add(textView);

		rows.push(contactsRow);

		var websiteLinkRow = Ti.UI.createTableViewRow({
			hasDetail : true,
			title : 'Cloud CMS',
			header : 'Powered By',
			url : 'http://www.cloudcms.com'
		});

		rows.push(websiteLinkRow);

        // Custom header row
        var headerLabel = Ti.UI.createLabel({
            width:'100%',
            color: '#000',
            text: node.get('tagline'),
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            font: {
                fontWeight:'bold',
                fontSize:20
            }
        });
        var headerView = Ti.UI.createView({
            backgroundColor: '#fff',
            height: 35,
            width:'100%'
        });
        headerView.add(headerLabel);

		// create table view
		var tableViewOptions = {
			data : rows,
			style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor : 'transparent',
			headerView : headerView,
			rowBackgroundColor : 'white'
		};

		var tableview = Titanium.UI.createTableView(tableViewOptions);

		// create table view event listener
		tableview.addEventListener('click', function(e) {
			if(e.rowData.url) {
				Titanium.Platform.openURL(e.rowData.url);
			}
		});

		win.add(tableview);
	});
});
