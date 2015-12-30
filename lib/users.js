Meteor.methods({
  addPublicApp(appId){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }

    let added = _.includes(Meteor.user().publicApps,appId);
    if (added){
      throw new Meteor.Error("This app has already been added!");
    }

    var user = Meteor.users.findOne({"_id": Meteor.userId()});
    Meteor.users.update(user, {$push: {"publicApps": appId}})
  },

  removePublicApp(appId){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }
    Meteor.users.update(Meteor.user(), {$pull: {publicApps:appId}})
  }
});