/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * userApps.js declares methods for UserApps collection.
 *******************************************************************************/
Meteor.methods({
  addPublicApp(appId, appName, logoURL, loginLink, registerLink){
    localSimulateLatency(500);
    //console.log("addPublicApp start");
    const userId = Meteor.userId();
    generalErrorCheck(Meteor.userId());

    let credentialRecord = UserAppCredentials.findOne({userId: userId});

    let usernameList = [];
    credentialRecord.publicApps.map(function (publicApp) {
      if (publicApp.appId === appId) {
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
              "registerLink": registerLink,
              "userNames": usernameList,
              "defaultUserName": "",
              "lastLoginTime": ""
            }
          }
        }
    );

    if (ZenApps.findOne({_id: appId}).subscribeCount != null) {//Update subscription count
      ZenApps.update(
          {_id: appId},
          {
            $inc: {subscribeCount: 1}
          }
      )
    } else {
      ZenApps.update(
          {_id: appId},
          {
            $set: {subscribeCount: 1}
          }
      )
    }
  },

  removePublicApp(appId){
    localSimulateLatency(500);
    //console.log("removePublicApp start");
    generalErrorCheck(Meteor.userId());

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
    generalErrorCheck(Meteor.userId());
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
    generalErrorCheck(Meteor.userId());

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
  },

  addEncryptionInfo(hexSalt, hexIv){
    const userId = Meteor.userId();
    //TODO implement inserting user salt, call it in "APP", 在保存密码前用passwordKey加密,保存iv和密文,
    // 获得密码前用password解密
    generalErrorCheck(Meteor.userId());
    UserApps.update({userId: userId}, {
      $set: {
        hexSalt: hexSalt,
        hexIv: hexIv
      }
    });
  }
});

function generalErrorCheck(userId) {
  checkUserLogin();

  let credentialRecord = UserAppCredentials.findOne({userId: userId});
  if (credentialRecord.count === 0) {
    throw new Meteor.Error("user record error");
  }
}