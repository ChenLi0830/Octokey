Meteor.methods({
    addNewCategory(name, displayTitleChinese, displayTitleEnglish, index){
        localSimulateLatency(500);
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
        localSimulateLatency(500);
        ZenCategories.remove({_id: categoryId});
    }
});

