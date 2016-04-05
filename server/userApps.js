/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * userApps.js declares methods for UserApps collection.
 *******************************************************************************/
Meteor.methods({

  /**
   * User subscribe to a public app.
   * @param {string} appId - App Id.
   * @param {string} appName - App name.
   * @param {string} logoURL - The URL of app's logo.
   * @param {string} loginLink - Login link.
   * @param {string} registerLink - Register link.
   */
  subscribePublicApp(appId, appName, logoURL, loginLink, registerLink){
    //Todo 检查和polish userApps里的方法
    localSimulateLatency(500);
    //console.log("subscribePublicApp start");
    checkUserLogin();
    const userId = this.userId;

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

  unsubscribePublicApp(appId){
    localSimulateLatency(500);
    //console.log("unsubscribePublicApp start");
    checkUserLogin();

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
    checkUserLogin();

    Meteor.call("checkUsernameExist", appId, username);

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
    checkUserLogin();

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
    checkUserLogin();
    UserApps.update({userId: userId}, {
      $set: {
        hexSalt: hexSalt,
        hexIv: hexIv
      }
    });
  },

  checkUsernameExist(appId, username){
    checkUserLogin();

    const usernameExists = UserApps.findOne({
      $and: [
        {userId: this.userId},
        {"publicApps.appId": appId},
        {"publicApps.userNames": username}
      ]
    });
    //console.log("checkAppUserNameExist", !!usernameExists);
    if (!!usernameExists){
      throw new Meteor.Error("userApps: 该用户名已经存在");
    }
  },

  /**
   * When a public app is updated, this method change every single record of the public app in the
   * UserApps collection.
   * @param {string} appId - Id of the to-be-updated app.
   * @param {string} appName - Name of the app.
   * @param {string} loginLink - login link of the app.
   * @param {string} registerLink - register link of the app.
   */
  updateUserApps(appId, appName, loginLink, registerLink) {
    checkAdmin();

    let ids = UserApps.find({"publicApps.appId": appId}).map(function (publicApp) {
      return publicApp.userId;
    });
    //console.log(ids);
    UserApps.update({
          $and: [
            {userId: {$in: ids}},
            {"publicApps.appId": appId}
          ]
        },
        {
          $set: {
            "publicApps.$.appName": appName,
            "publicApps.$.loginLink": loginLink,
            "publicApps.$.registerLink": registerLink,
          }
        },
        {multi: true}
    );
  },

});