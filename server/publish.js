/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * publish.js controls the publish part for all collections.
 *******************************************************************************/
Meteor.publish("zenApps", function () {
    localSimulateLatency(800);
    if (this.userId) {
        return ZenApps.find();
    }
});

Meteor.publish("userApps", function () {
    localSimulateLatency(500);
    return UserApps.find({userId: this.userId})
});

Meteor.publish("zenCategories", function () {
    localSimulateLatency(500);
    if (this.userId) {
        return ZenCategories.find();
    }
});

Meteor.publish("appCredential", function (userId, appId, username) {
    localSimulateLatency(800);
    //console.log("publish appCredential", userId, appId, username);
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
            ]
        },
        {fields: {'publicApps.$': 1}});
    return result;
});
