/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * userAppCredentials.js declare the methods for UserAppCredentials collection.
 *******************************************************************************/
Meteor.methods({

  /**
   * Add a new credential for the user in a specific app
   * @param {string} appId - Id of the app.
   * @param {string} username - Username of the account.
   * @param {string} password - Password of the account.
   */
  addNewCredential(appId, username, password){
    localSimulateLatency(500);
    console.log("addNewCredential:", "appId", appId, "username", username, "password", password);
    const userId = this.userId;

    checkUserLogin.call(this);

    if (Meteor.call("isUserCredentialExist", appId, username)) {
      throw new Meteor.Error("userAppCredentials: 该用户名已经存在");
    }

    UserAppCredentials.update({userId: userId}, {
      $addToSet: {
        publicApps: {"appId": appId, "username": username, "password": password}
      }
    });
  },

  /**
   * Remove credentials by appId and username. Theoretically there should be <=1 record
   * that matches the the appId and username. But if there are more than one record matched, all of
   * them will be removed.
   * @param {string} appId - Id of the app.
   * @param {string} username - Username of the account.
   */
  removeCredential(appId, username){
    localSimulateLatency(500);
    console.log("removeCredential start", "appId", appId, "username", username);
    checkUserLogin.call(this);

    UserAppCredentials.update({userId: this.userId}, {
          $pull: {
            publicApps: {"appId": appId, "username": username}
          }
        }
    );
  },

  /**
   * update user account's the password for a specific app
   * @param {string} appId - Id of the app.
   * @param {string} username - Username of the account.
   * @param {string} password - To-be-updated password.
   */
  updateUserCredential(appId, username, password){
    localSimulateLatency(500);
    console.log("updateUserCredential:", "appId", appId, "username", username, "password",
        password);

    UserAppCredentials.update(
        {
          $and: [
            {"userId": this.userId},
            {"publicApps": {$elemMatch: {"appId": appId, "username": username}}}
          ]
        },
        {$set: {"publicApps.$.password": password}}
    );
  },

  /**
   * Returns whether the username exists for this user in a specific app (in collection
   * UserAppCredentials)
   * @param {string} appId - Id of the app.
   * @param {string} username - username.
   * @returns {boolean} usernameExists - Whether the username exists
   */
  isUserCredentialExist(appId, username){
    checkUserLogin.call(this);

    const usernameExists = UserAppCredentials.findOne({
      $and: [
        {userId: this.userId},
        {"publicApps.appId": appId},
        {"publicApps.userNames": username}
      ]
    });
    return !!usernameExists;
  },
});