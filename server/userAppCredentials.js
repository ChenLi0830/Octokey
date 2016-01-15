Meteor.methods({
  addNewCredential(appId, username, password){
    console.log("addNewCredential start:", "appId", appId, "username", username, "password", password);
    let userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("not logged in");
    }

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

  removeCredential(appId, username, password){
    console.log("removeCredential start");
    if (Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }
    UserAppCredentials.update({userId: Meteor.userId()}, {
      $pull: {
        publicApps: {"appId": appId, "username": username, "password": password}
      }
    })
  },
});