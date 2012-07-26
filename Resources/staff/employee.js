/**
 * Displays information of individual employee.
 */
Ti.include("../cloudcms/gitana.js");
Ti.include("../common/app_common.js");

var userId = win.userId;
var rows = [];

var createAssociationUserRow = function(otherUser, index, header) {
	var otherUserAvatarImage = Titanium.UI.createImageView({
		image : otherUser.avatar,
		width : 80,
		left : 5,
		top : 10,
		bottom : 10
	});

	var options = {
		height : 'auto'
	};

	if(index == 0) {
		options['header'] = header;
	}
	var otherUserDetailsRow = Ti.UI.createTableViewRow(options);

	otherUserDetailsRow.add(otherUserAvatarImage);

	var otherUserTextView = Ti.UI.createView({
		height : 'auto',
		layout : 'vertical',
		left : 85,
		top : 10,
		bottom : 10,
		right : 10
	});

	var otherUserNameLabel = Ti.UI.createLabel({
		text : otherUser.name,
		color : '#000000',
		shadowColor : '#FFFFE6',
		shadowOffset : {
			x : 0,
			y : 1
		},
		textAlign : 'left',
		height : 'auto',
		top : 10,
		font : {
			fontWeight : 'bold',
			fontSize : 16
		}
	});

	otherUserTextView.add(otherUserNameLabel);

	var otherUserPositionLabel = Ti.UI.createLabel({
		text : otherUser.position,
		color : '#000000',
		shadowColor : '#FFFFE6',
		textAlign : 'left',
		shadowOffset : {
			x : 0,
			y : 1
		},
		font : {
			fontSize : 13
		},
		height : 'auto',
		top : 10
	});

	otherUserTextView.add(otherUserPositionLabel);

	otherUserDetailsRow.add(otherUserTextView);

	otherUserDetailsRow.addEventListener('click', function(e) {
		var employeeWin = Ti.UI.createWindow({
			url : 'employee.js',
			title : otherUser.name,
			userId : otherUser.userId,
			backgroundColor : '#ffffff',
			cloudCMSContext : cloudCMSContext,
			whcDomain : whcDomain
		});
		Ti.UI.currentTab.open(employeeWin);
	});

	return otherUserDetailsRow;
}
var createArrayItemsRow = function(data, header) {
	var arrayItemsRow = Ti.UI.createTableViewRow({
		height : 'auto',
		header : header
	});

	var textView = Ti.UI.createView({
		height : 'auto',
		layout : 'vertical',
		left : 10,
		top : 5,
		bottom : 10,
		right : 10
	});

	for(var index = 0; index < data.length; index++) {
		var arrayItemLabel = Ti.UI.createLabel({
			text : data[index],
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : 'left',
			height : 'auto',
			top : 5,
			font : {
				fontWeight : 'bold',
				fontSize : 16
			}
		});

		textView.add(arrayItemLabel);
	}
	arrayItemsRow.add(textView);
	return arrayItemsRow;
}
var branch = cloudCMSContext.branch();
whcDomain.readPrincipal(userId).then(function() {
	var user = this;
	Ti.API.info("User: " + user.getName());
	var avatarImageUrl = user.attachment('avatar').getDownloadUri();
	var fullName = user.getLastName() + ',' + user.getFirstName();
	var friendlyName = user.getFirstName() + ' ' + user.getLastName();
	var email = user.getEmail();
	Ti.API.info("Email: " + email);

	this.readPersonNode(branch).then(function() {
		var personNode = this;
		var position = this.get('currentPosition') ? this.get('currentPosition') : "";
		var gender = this.get('gender') ? this.get('gender') : "";
		var phone = this.get('phone') ? this.get('phone') : "";
		var biography = this.get('biography') ? this.get('biography') : "";
		var nickname = this.get('nickname') ? this.get('nickname') : "";
		var specialty = this.get('specialty') ? this.get('specialty') : [];
		var education = this.get('education') ? this.get('education') : [];
		var languages = this.get('languages') ? this.get('languages') : [];

		Ti.API.info("Position: " + position);

		var avatarImage = Titanium.UI.createImageView({
			image : avatarImageUrl,
			width : 80,
			height : 120,
			left : 5,
			top : 20,
			bottom : 10
		});

		var detailsRow = Ti.UI.createTableViewRow({
			height : 'auto'
		});

		detailsRow.add(avatarImage);

		var textView = Ti.UI.createView({
			height : 'auto',
			layout : 'vertical',
			left : 90,
			top : 10,
			bottom : 10,
			right : 10
		});

		var nameLabel = Ti.UI.createLabel({
			text : friendlyName,
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : 'left',
			height : 'auto',
			top : 5,
			font : {
				fontWeight : 'bold',
				fontSize : 16
			}
		});

		textView.add(nameLabel);

		if(nickname) {
			var nicknameLabel = Ti.UI.createLabel({
				text : "( " + nickname + " )",
				color : '#000000',
				shadowColor : '#FFFFE6',
				shadowOffset : {
					x : 0,
					y : 1
				},
				textAlign : 'left',
				height : 'auto',
				top : 5,
				font : {
					fontSize : 13
				}
			});
			textView.add(nicknameLabel);
		}

		var positionLabel = Ti.UI.createLabel({
			text : position,
			color : '#000000',
			shadowColor : '#FFFFE6',
			shadowOffset : {
				x : 0,
				y : 1
			},
			textAlign : 'left',
			height : 'auto',
			top : 5,
			font : {
				fontWeight : 'bold',
				fontSize : 13
			}
		});

		textView.add(positionLabel);

		var phoneLabel = Ti.UI.createLabel({
			text : phone,
			color : '#000000',
			shadowColor : '#FFFFE6',
			textAlign : 'left',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 13
			},
			height : 'auto',
			top : 5
		});

		var emailLabel = Ti.UI.createLabel({
			text : email,
			color : '#000000',
			shadowColor : '#FFFFE6',
			textAlign : 'left',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 13
			},
			height : 'auto',
			top : 5
		});

		textView.add(phoneLabel);
		textView.add(emailLabel);

		detailsRow.add(textView);

		rows.push(detailsRow);

		if(education.length > 0) {
			rows.push(createArrayItemsRow(education, "Education"));
		}

		if(specialty.length > 0) {
			rows.push(createArrayItemsRow(specialty, "Specialty"));
		}

		if(languages.length > 0) {
			rows.push(createArrayItemsRow(languages, "Languages"));
		}

		var biographyLabel = Ti.UI.createLabel({
			text : biography,
			color : '#000000',
			shadowColor : '#FFFFE6',
			textAlign : 'left',
			shadowOffset : {
				x : 0,
				y : 1
			},
			font : {
				fontSize : 13
			},
			height : 'auto',
			width : 'auto',
			height : 'auto',
			top : 10,
			left : 10,
			bottom : 10
		});

		var biographyRow = Ti.UI.createTableViewRow({
			height : 'auto',
			header : 'Biography'
		});

		biographyRow.add(biographyLabel);

		rows.push(biographyRow);

		var supervisors = [];
		var subordinates = [];
		var relationships = [];

		this.traverse({
			"associations" : {
				"whc:manages" : "ANY"
			},
			"depth" : 1
		}).associations().each(function(key, association, index) {
			var type = association.getTypeQName();
			var direction = association.getDirection(personNode);
			this.readOtherNode(personNode).then(function() {
				var otherPersonId = this.get('principal-id');
				var otherPersonPosition = this.get('currentPosition') ? this.get('currentPosition') : "";
				this.subchain(whcDomain).readPrincipal(otherPersonId).then(function() {
					var otherUser = this;
					var otherUserAvatarImageUrl = otherUser.attachment('avatar').getDownloadUri();
					var otherUserFullName = otherUser.getLastName() + ',' + otherUser.getFirstName();
					var otherUserDetails = {
						'userId' : otherPersonId,
						'position' : otherPersonPosition,
						'name' : otherUserFullName,
						'avatar' : otherUserAvatarImageUrl
					};
					Ti.API.info("Other user details: " + JSON.stringify(otherUserDetails));
					Ti.API.info("direction: " + direction);
					if(type == "whc:manages") {
						if(direction == 'OUTGOING') {
							subordinates.push(otherUserDetails);
							Ti.API.info("pushed to subordinates");
						} else if(direction == 'INCOMING') {
							supervisors.push(otherUserDetails);
							Ti.API.info("pushed to superviors");
						}
					} else {
						//relationships.push(otherUserDetails);
					}
				});
			});
		}).then(function() {

			Ti.API.info("supervisors.length : " + supervisors.length);
			if(supervisors.length > 0) {
				for(var index = 0; index < supervisors.length; index++) {
					var otherUserDetailsRow = createAssociationUserRow(supervisors[index], index, 'Supervisors');
					rows.push(otherUserDetailsRow);
				}
			}
			if(subordinates.length > 0) {
				for(var index = 0; index < subordinates.length; index++) {
					var otherUserDetailsRow = createAssociationUserRow(subordinates[index], index, 'Subordinates');
					rows.push(otherUserDetailsRow);
				}
			}
			if(relationships.length > 0) {
				for(var index = 0; index < relationships.length; index++) {
					var otherUserDetailsRow = createAssociationUserRow(relationships[index], index, 'Relationships');
					rows.push(otherUserDetailsRow);
				}
			}

			var tableViewOptions = {
				data : rows,
				style : Titanium.UI.iPhone.TableViewStyle.GROUPED,
				backgroundColor : 'transparent',
				rowBackgroundColor : 'white'
			};

			var tableview = Titanium.UI.createTableView(tableViewOptions);

			// create table view event listener
			tableview.addEventListener('click', function(e) {
				if(e.rowData.test) {
					var win = Titanium.UI.createWindow({
						url : e.rowData.test,
						title : e.rowData.title
					});
					Titanium.UI.currentTab.open(win, {
						animated : true
					});
				}
			});

			win.add(tableview);
		});
	});
});
