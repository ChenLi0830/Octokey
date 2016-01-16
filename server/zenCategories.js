Meteor.methods({
  addNewCategory(name, displayTitleChinese, displayTitleEnglish){
    ZenCategories.insert({
      name:name,
      displayTitleChinese:displayTitleChinese,
      displayTitleEnglish:displayTitleEnglish,
      clickCount:0,
      createdAt:new Date()
    });
  },

  removeCategory(name){
    ZenCategories.remove({name:name});
  }
});