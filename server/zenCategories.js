Meteor.methods({
    addNewCategory(name, displayTitleChinese, displayTitleEnglish, index){
        ZenCategories.insert({
            name: name,
            displayTitleChinese: displayTitleChinese,
            displayTitleEnglish: displayTitleEnglish,
            clickCount: 0,
            index: Number(index),
            createdAt: new Date()
        });
    },

    removeCategory(categoryId){
        ZenCategories.remove({_id: categoryId});
    }
});

