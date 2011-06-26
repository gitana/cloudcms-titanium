Ti.include("gitana/gitana.js");
// use 10.0.2.2 for android
var win = Ti.UI.currentWindow;
var gitanaContext = win.gitanaContext;
var userId = win.userId;
var rows = [];

if (Ti.Platform.name == 'android') {
    Titanium.UI.currentWindow.backgroundColor = '#4e5c4d';
}
else {
    Titanium.UI.currentWindow.backgroundColor = '#aebcad';
}

var createAssociationUserRow = function (otherUser,index,header) {
    var otherUserAvatarImage = Titanium.UI.createImageView({
        image : otherUser.avatar,
        width: 80,
        left: 5,
        top: 10,
        bottom :10
    });

    var options = {
        height: 'auto'
    };

    if (index == 0) {
        options['header'] = header;
    }
    var otherUserDetailsRow = Ti.UI.createTableViewRow(options);

    otherUserDetailsRow.add(otherUserAvatarImage);

    var otherUserTextView = Ti.UI.createView({
        height:'auto',
        layout:'vertical',
        left:85,
        top:10,
        bottom:10,
        right:10
    });

    var otherUserNameLabel = Ti.UI.createLabel({
        text: otherUser.name,
        color: '#420404',
        shadowColor:'#FFFFE6',
        shadowOffset:{x:0,y:1},
        textAlign:'left',
        height:'auto',
        top:10,
        font:{fontWeight:'bold',fontSize:16}
    });

    otherUserTextView.add(otherUserNameLabel);

    var otherUserPositionLabel = Ti.UI.createLabel({
        text: otherUser.position,
        color: '#420404',
        shadowColor:'#FFFFE6',
        textAlign:'left',
        shadowOffset:{x:0,y:1},
        font:{fontSize:13},
        height:'auto',
        top:10
    });

    otherUserTextView.add(otherUserPositionLabel);

    otherUserDetailsRow.add(otherUserTextView);

    otherUserDetailsRow.addEventListener('click', function(e) {
        var employeeWin = Ti.UI.createWindow({
            url: 'employee.js',
            title: otherUser.name,
            userId: otherUser.userId,
            backgroundColor:'#aebcad',
            gitanaContext: gitanaContext
        });
        Ti.UI.currentTab.open(employeeWin);
    });

    return otherUserDetailsRow
}

var branch = gitanaContext.branch();
branch.getServer().readUser(userId).then(function() {
    var user = this;
    Ti.API.info("User: " + user.getId());
    var avatarImageUrl = user.attachment('avatar').getDownloadUri();
    var fullName = user.getLastName() + ',' + user.getFirstName();
    var email = user.getEmail();
    Ti.API.info("Email: " + email);

    this.readPerson(branch).then(function() {
        var personNode = this;
        var position = this.get('currentPosition');
        var gender = this.get('gender');
        var biography = this.get('biography');
        var nickname = this.get('nickname');

        Ti.API.info("Position: " + position);

        var avatarImage = Titanium.UI.createImageView({
            image : avatarImageUrl,
            width: 80,
            left: 5,
            top: 10,
            bottom :10
        });

        var detailsRow = Ti.UI.createTableViewRow({
            height: 'auto',
            header:'Details'
        });

        detailsRow.add(avatarImage);

        var textView = Ti.UI.createView({
            height:'auto',
            layout:'vertical',
            left:85,
            top:10,
            bottom:10,
            right:10
        });

        var positionLabel = Ti.UI.createLabel({
            text: position,
            color: '#420404',
            shadowColor:'#FFFFE6',
            shadowOffset:{x:0,y:1},
            textAlign:'left',
            height:'auto',
            top:10,
            font:{fontWeight:'bold',fontSize:16}
        });

        textView.add(positionLabel);

        var emailLabel = Ti.UI.createLabel({
            text: email,
            color: '#420404',
            shadowColor:'#FFFFE6',
            textAlign:'left',
            shadowOffset:{x:0,y:1},
            font:{fontSize:13},
            height:'auto',
            top:10
        });

        textView.add(emailLabel);

        detailsRow.add(textView);

        rows.push(detailsRow);

        var biographyLabel = Ti.UI.createLabel({
            text: biography,
            color: '#420404',
            shadowColor:'#FFFFE6',
            textAlign:'left',
            shadowOffset:{x:0,y:1},
            font:{fontSize:13},
            height: 'auto',
            width: 'auto',
            height: 'auto',
            top: 10,
            left:10,
            bottom:10
        });

        var biographyRow = Ti.UI.createTableViewRow({
            height: 'auto',
            header:'Biography'
        });

        biographyRow.add(biographyLabel);

        rows.push(biographyRow);

        var supervisors = [];
        var subordinates = [];
        var relationships = [];

        this.traverse({
            "associations": {
                "theoffice:manages": "ANY",
                "theoffice:inRelationshipWith": "ANY"
            },
            "depth": 1
        }).associations().each(function(key, association, index) {
            var type = association.getTypeQName();
            var direction = association.getDirection(personNode);
            this.readOtherNode(personNode).then(function() {
                var otherPersonId = this.get('principal-id');
                var otherPersonPosition = this.get('currentPosition');
                this.subchain(this.getServer()).readUser(otherPersonId).then(function() {
                    var otherUser = this;
                    var otherUserAvatarImageUrl = otherUser.attachment('avatar').getDownloadUri();
                    var otherUserFullName = otherUser.getLastName() + ',' + otherUser.getFirstName();
                    var otherUserDetails = {
                        'userId' : otherPersonId,
                        'position' : otherPersonPosition,
                        'name' : otherUserFullName,
                        'avatar' :otherUserAvatarImageUrl
                    };
                    Ti.API.info("Other user details: " + JSON.stringify(otherUserDetails));
                    Ti.API.info("direction: " + direction);
                    if (type == "theoffice:manages") {
                        if (direction == 'OUTGOING') {
                            subordinates.push(otherUserDetails);
                            Ti.API.info("pushed to subordinates");
                        } else if (direction == 'INCOMING') {
                            supervisors.push(otherUserDetails);
                            Ti.API.info("pushed to superviors");
                        }
                    } else {
                        relationships.push(otherUserDetails);
                    }
                });
            });
        }).then(function() {
            Ti.API.info("supervisors.length : "+ supervisors.length);
            if (supervisors.length > 0) {
                for (var index = 0 ; index < supervisors.length ; index ++) {
                    var otherUserDetailsRow = createAssociationUserRow(supervisors[index],index,'Supervisors');
                    rows.push(otherUserDetailsRow);
                }
            }
            if (subordinates.length > 0) {
                for (var index = 0 ; index < subordinates.length ; index ++) {
                    var otherUserDetailsRow = createAssociationUserRow(subordinates[index],index,'Subordinates');
                    rows.push(otherUserDetailsRow);
                }
            }
            if (relationships.length > 0) {
                for (var index = 0 ; index < relationships.length ; index ++) {
                    var otherUserDetailsRow = createAssociationUserRow(relationships[index],index,'Relationships');
                    rows.push(otherUserDetailsRow);
                }
            }

            var headerTitle = fullName;
            if (nickname) {
                headerTitle += ' (' + nickname + ')';
            }
            var tableViewOptions = {
                data:rows,
                style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
                headerTitle: headerTitle,
                backgroundColor:'transparent',
                rowBackgroundColor:'white'
            };

            var tableview = Titanium.UI.createTableView(tableViewOptions);

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