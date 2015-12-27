Meteor.publish("formalApps", function () {
  return FormalApps.find({
    $or: [
      {private: {$ne: true}},
      {owner: this.userId}
    ]
  });
});
