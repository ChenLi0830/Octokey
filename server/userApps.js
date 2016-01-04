//TODO add methods for formalApps
//addPublicApp(userId, appId)
//publicAppConfigured (userId, appId)
//getPublicApps (userId)
Meteor.methods({

  addPublicApp(appId){
    const userId = Meteor.userId();


    if (!userId) {
      throw new Meteor.Error("not signed in");
    }
    const userExists = !!Meteor.users.find({_id: userId});
    if (!userExists) {
      throw new Meteor.Error("user doesn't exist");
    }

    const userHasApps = UserApps.find({userId: userId}).count();

    if (userExists && !userHasApps) {//Add new object
      UserApps.insert({
        userId: userId,
        publicApps: [],
        privateApps: []
      });
    }

    const userHasThisApp = UserApps.find({
      $and: [
        {userId: userId},
        {
          publicApps: {appId: appId}
        }
      ]
    }).count()>0;

    if(userHasThisApp){
      throw new Meteor.Error("User already added this app.");
    }

    UserApps.update(
      {userId: userId},
      {
        $push: {
          "publicApps": {"appId": appId, "configured": false}
        }
      }
    );
  },

  removePublicApp(appId){
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
  }
});