/*
 Meteor.publish("formalApps", function () {
 return FormalApps.find({
 $or: [
 {private: {$ne: true}},
 {owner: this.userId}
 ]
 });
 });
 */


Meteor.publish("zenApps", function () {
  return ZenApps.find();
});

Meteor.publish("userApps", function () {
  return UserApps.find({userId: this.userId})
});

//Meteor.publish("userAppCredentials", function () {
//  return UserAppCredentials.find({userId: this.userId}, {
//    fields: {
//      "publicApps.password": 0,
//      "privateApps.password": 0
//    }
//  });
//});

Meteor.publish("appCredential", function (userId, appId, username) {
  console.log(userId, appId, username);
  //console.log("this.user", this.user);
  let result = UserAppCredentials.find(
    {
      $and: [
        {userId: userId},
        {"publicApps.appId": appId},
        {"publicApps.username": username}
      ]
    },
    //);
    {fields: {'publicApps.$': 1}});

  return result;
});
