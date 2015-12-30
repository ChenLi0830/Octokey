Meteor.publish("formalApps", function () {
  return FormalApps.find({
    $or: [
      {private: {$ne: true}},
      {owner: this.userId}
    ]
  });
});


Meteor.publish("zenApps", function () {
  console.log("Publishing ZenID defined apps");
  return ZenApps.find();
});