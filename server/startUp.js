Meteor.startup(function () {
  if (ZenCategories.find().count() === 0) {
    ZenCategories.insert({
      name:"all",
      displayTitleChinese:"全部",
      displayTitleEnglish:"All",
      clickCount:0,
      createdAt: new Date()
    });
  }
});

