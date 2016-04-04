/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * userAppCredentials.js declare the methods for UserAppCredentials collection.
 *******************************************************************************/
Meteor.methods({
  addNewCredential(appId, username, password){
    localSimulateLatency(500);
    console.log("addNewCredential start:", "appId", appId, "username", username, "password",
        password);
    let userId = Meteor.userId();
    checkUserLogin();

    //Todo check if username exit for appNewCredential
    let userHasThisApp = UserApps.find({
      $and: [
        {userId: userId},
        {
          publicApps: {appId: appId}
        }
      ]
    });
    if (!userHasThisApp) {
      throw new Meteor.Error("User doesn't have this app.");
    }

    const userHasCredentials = UserAppCredentials.find({userId: userId}).count();

    if (!userHasCredentials) {//如果用户存在,但在userHasCredentials里没有建立用户档案,就add new 档案
      UserAppCredentials.insert({
        userId: userId,
        publicApps: [],
        privateApps: []
      });
    }

    UserAppCredentials.update({userId: userId}, {
      $addToSet: {
        publicApps: {"appId": appId, "username": username, "password": password}
      }
    });
  },

  removeCredential(appId, username){
    localSimulateLatency(500);
    console.log("removeCredential start", "appId", appId, "username", username);
    checkUserLogin();

    UserAppCredentials.update({userId: Meteor.userId()}, {
          $pull: {
            publicApps: {"appId": appId, "username": username}
          }
        }
    );

  },
});