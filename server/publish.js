/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * publish.js controls the publish part for all collections.
 *******************************************************************************/
Meteor.publish("topics", function () {
  localSimulateLatency(500);
  checkUserLogin.call(this);
  return Topics.find({});
});

Meteor.publish("userApps", function () {
  localSimulateLatency(500);
  return UserApps.find({userId: this.userId});
});

Meteor.publish("allCategories", function () {
  localSimulateLatency(500);
  return ZenCategories.find({});
});

Meteor.publish("userCredentials", function () {
  localSimulateLatency(800);
  checkUserLogin.call(this);
  //console.log("publish appCredential", userId, appId, username);
  //console.log("this.user", this.user);
  return UserAppCredentials.find({userId: this.userId});
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

/**
 * Public all user apps to data Analysis server
 * @returns {cursor} - the cursor of all documents from UserApps
 */
Meteor.publish("allUserApps", function () {
  localSimulateLatency(500);
  checkAdmin.call(this);
  return UserApps.find({}, {fields: {"userId": 1, "publicApps.appId": 1, "publicApps.appName": 1}});
});

/**
 * Public all public apps to data Analysis server
 * @returns {cursor} - the cursor of all documents from ZenApps
 */
Meteor.publish("allPublicApps", function () {
  localSimulateLatency(500);
  checkAdmin.call(this);
  return ZenApps.find({}, {fields: {"appName": 1}});
});
