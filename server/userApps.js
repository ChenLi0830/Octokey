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
   */
  subscribePublicApp(appId){
    //Todo 检查和polish userApps里的方法
    localSimulateLatency(500);
    //console.log("subscribePublicApp start");
    checkUserLogin.call(this);
    const userId = this.userId;

    const app = ZenApps.findOne({_id: appId});

    let credentialRecord = UserAppCredentials.findOne({userId: userId});

    // 处理用户的usernames
    let usernameList = [];
    credentialRecord.publicApps.map(function (publicApp) {
      if (publicApp.appId === appId) {
        usernameList.push(publicApp.username);
      }
    });

    console.log("user subscribes app", app);
    UserApps.update(//前面的check都通过,then add this public app to user's record
        {userId: userId},
        {
          $addToSet: {//用addToSet而不是push来防止已经有该app的情况
            "publicApps": {
              "appId": appId,
              "appName": app.appName,
              "logoURL": app.noLogo ? "":"cfs/files/zenApps/"+appId,
              "loginLink": app.loginLink,
              "registerLink": app.registerLink,
              "userNames": usernameList,
              "defaultUserName": "",
              "lastLoginTime": "",
              "popUpLoginFlag": app.popUpLoginFlag || false,
              "homepageLink": app.homepageLink || "",
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
    checkUserLogin.call(this);

    UserApps.update(
        {userId: this.userId},
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
    checkUserLogin.call(this);
    console.log("appAddUsername start");

    if (Meteor.call("isUsernameExist", appId, username)) {
      throw new Meteor.Error("userApps: 该用户名已经存在");
    }

    console.log("start to update");
    UserApps.update(
        {
          $and: [
            {"userId": this.userId},
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
    checkUserLogin.call(this);

    UserApps.update(
        {
          $and: [
            {"userId": this.userId},
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
    const userId = this.userId;
    //TODO implement inserting user salt, call it in "APP", 在保存密码前用passwordKey加密,保存iv和密文,
    // 获得密码前用password解密
    checkUserLogin.call(this);
    UserApps.update({userId: userId}, {
      $set: {
        hexSalt: hexSalt,
        hexIv: hexIv
      }
    });
  },

  /**
   * Returns whether the username exists for this user in a specific app (in collection 'UserApps')
   * @param {string} appId - Id of the app.
   * @param {string} username - username.
   * @returns {boolean} usernameExists - Whether the username exists
   */
  isUsernameExist(appId, username){
    checkUserLogin.call(this);

    const usernameExists = UserApps.findOne({
      $and: [
        {userId: this.userId},
        {"publicApps": {$elemMatch: {
          "appId": appId,
          "userNames":{$in:[username]}
        }}}
      ]
    });
    return !!usernameExists;
  },

  checkUserHasAppById(appId){
    checkUserLogin.call(this);
    const userHasThisApp = UserApps.findOne({
      $and: [
        {userId: this.userId},
        {
          publicApps: {appId: appId}
        }
      ]
    });
    if (!userHasThisApp) {
      throw new Meteor.Error("User doesn't have this app.");
    }
  },

  /**
   * When a public app is updated, this method change every single record of the public app in the
   * UserApps collection.
   * @param {string} appId - Id of the to-be-updated app.
   */
  updateUserApps(appId) {
    console.log("updateUserApps");
    checkAdmin.call(this);

    const app = ZenApps.findOne({_id: appId});

    let ids = UserApps.find({"publicApps.appId": appId}).map(function (publicApp) {
      return publicApp.userId;
    });
    UserApps.update({
          $and: [
            {userId: {$in: ids}},
            {"publicApps.appId": appId}
          ]
        },
        {
          $set: {
            "publicApps.$.appName": app.appName,
            "publicApps.$.logoURL": app.noLogo ? "":"cfs/files/zenApps/"+appId,
            "publicApps.$.loginLink": app.loginLink,
            "publicApps.$.registerLink": app.registerLink,
            "publicApps.$.popUpLoginFlag": !!app.popUpLoginFlag,
            "publicApps.$.homepageLink": app.homepageLink,
          }
        },
        {multi: true}
    );
  },
  /**
   * When the Recommendation System done calculating the recommending results for a user, it calls
   * this method to insert the results.
   * @param {string} userId - the userId to be inserted.
   * @param {{appId: string, score: number}[]} recommendedApps - Id of the to-be-updated app.
   */
  addRecommendedApps(userId, recommendedApps){
    UserApps.update(
        {userId: userId},
        {
          $set: {
            recommendedApps: recommendedApps
          }
        }
    )
  },

  /**
   * User follow topics
   * @param {object[]} topics - The topics being followed by the user
   * @param topic.topicId - the Id of the topic
   * @param topic.topicName - the name of the topic
   * @param topic.topicRank - the Rank of the topic
   */
  followTopics(topics){
    console.log("followTopics start, topics: ", topics);
    checkUserLogin.call(this);
    for (let i = 0; i < topics.length; i++) {
      let topic = topics[i];
      UserApps.update({userId: this.userId}, {
        $addToSet: {
          topics: {topicId: topic.topicId, topicName: topic.topicName, topicRank: topic.topicRank}
        }
      });

      //Make record changes in Topics collection
      Meteor.call('topicIsFollowed', topics[i].topicId);
    }
  },

  /**
   * User update followed topics
   * @param {object[]} topics - The topics being followed by the user
   * @param topic.topicId - the Id of the topic
   * @param topic.topicName - the name of the topic
   * @param topic.topicRank - the Rank of the topic
   */
  updateFollowedTopics(topics){
    checkUserLogin.call(this);

    //Unfollow all current topics
    UserApps.update({userId:this.userId}, {
      $set:{topics:[]}
    });

    for (let i = 0; i < topics.length; i++) {
      //Make record changes in Topics collection
      Meteor.call('topicIsUnfollowed', topics[i].topicId);
    }

    // Re-follow all the new topics
    Meteor.call('followTopics', topics);
  },

});