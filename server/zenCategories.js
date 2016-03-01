/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * it declares methods for ZenCatagories collection.
 *******************************************************************************/
Meteor.methods({
    addNewCategory(name, displayTitleChinese, displayTitleEnglish, index){
        localSimulateLatency(500);

        checkUserLogin();
        checkAdmin();
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

        checkUserLogin();
        checkAdmin();
        ZenCategories.remove({_id: categoryId});
    }
});

