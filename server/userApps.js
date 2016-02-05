/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * userApps.js declares methods for UserApps collection.
 *******************************************************************************/
Meteor.methods({
    addPublicApp(appId, appName, logoURL, loginLink){
        localSimulateLatency(500);
        //console.log("addPublicApp start");
        const userId = Meteor.userId();

        if (!userId) {//没登录
            throw new Meteor.Error("not signed in");
        }

        const userHasApps = UserApps.find({userId: userId}).count();

        if (!userHasApps) {//如果用户存在,但在userHasApps里没有建立用户档案,就add new 档案
            UserApps.insert({
                userId: userId,
                publicApps: [],
                privateApps: []
            });

            UserAppCredentials.insert({
                userId: userId,
                publicApps: [],
                privateApps: []
            });
        }

        let credentialRecord = UserAppCredentials.findOne({userId: userId});

        let usernameList = [];
        credentialRecord.publicApps.map(function(publicApp){
            if (publicApp.appId===appId){
                usernameList.push(publicApp.username);
            }
        });

        UserApps.update(//前面的check都通过,then add this public app to user's record
            {userId: userId},
            {
                $addToSet: {//用addToSet而不是push来防止已经有该app的情况
                    "publicApps": {
                        "appId": appId,
                        "appName": appName,
                        "logoURL": logoURL,
                        "loginLink": loginLink,
                        "userNames": usernameList,
                        "defaultUserName": "",
                        "lastLoginTime": ""
                    }
                }
            }
        );

        ZenApps.update(
            {_id: appId},
            {
                $inc: {subscribeCount: 1}
            }
        );
    },

    removePublicApp(appId){
        localSimulateLatency(500);
        //console.log("removePublicApp start");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not logged in");
        }
        UserApps.update(
            {userId: Meteor.userId()},
            {
                $pull: {
                    publicApps: {appId: appId}
                }
            }
        );

        ZenApps.update(
            {_id: appId},
            {
                $inc: {subscribeCount: -1}
            }
        );
    },

    appAddUsername(appId, username){
        localSimulateLatency(500);
        //console.log("addConfigured start");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not logged in");
        }
        UserApps.update(
            {
                $and: [
                    {"userId": Meteor.userId()},
                    {"publicApps.appId": appId}
                ]
            },
            {
                $addToSet: {
                    "publicApps.$.userNames": username
                }
            }
        )
    },

    appRemoveUsername(appId, username){
        localSimulateLatency(500);
        //console.log("appRemoveUsername start);
        if (!Meteor.userId()) {
            throw new Meteor.Error("not logged in");
        }
        UserApps.update(
            {
                $and: [
                    {"userId": Meteor.userId()},
                    {"publicApps.appId": appId}
                ]
            },
            {
                $pull: {
                    "publicApps.$.userNames": username
                }
            }
        )
    }
});