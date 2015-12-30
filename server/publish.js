Meteor.publish("formalApps", function () {
  return FormalApps.find({
    $or: [
      {private: {$ne: true}},
      {owner: this.userId}
    ]
  });
});


Meteor.publish("zenApps", function () {
  return ZenApps.find();
});


Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},{
    fields:
    {
      'publicApps': 1
    }});
});
