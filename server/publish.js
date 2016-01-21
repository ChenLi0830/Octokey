Meteor.publish("zenApps", function () {
    if (this.userId) {
        return ZenApps.find();
    }
});

Meteor.publish("userApps", function () {
    return UserApps.find({userId: this.userId})
});

Meteor.publish("zenCategories", function () {
    if (this.userId) {
        return ZenCategories.find();
    }
});

Meteor.publish("appCredential", function (userId, appId, username) {
    console.log("appCredential", userId, appId, username);
    //console.log("this.user", this.user);
    let result = UserAppCredentials.find(
        {
            $and: [
                {userId: userId},
                {
                    publicApps: {
                        $elemMatch: {
                            appId: appId,
                            username: username
                        }
                    }
                }
                //{"publicApps.appId": appId},
                //{"publicApps.username": username}
            ]
        },
        //);
        {fields: {'publicApps.$': 1}});
    return result;
});
