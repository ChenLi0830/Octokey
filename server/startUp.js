Meteor.startup(function () {
    //process.env.MAIL_URL = 'smtp://yichen.li0830@gmail.com:lizhengren@smtp.gmail.com:465/';
    process.env.MAIL_URL = 'smtp://postmaster@sandbox4e97a79afccd430d8897f90ad78054be.mailgun.org:0011d852303b11544220c77d6572bc1d@smtp.mailgun.org:587';
    //smtp://USERNAME:PASSWORD@HOST:PORT/

    //if (ZenCategories.find().count() === 0) {
    //    let initialCategories = [{
    //        name: "all",
    //        displayTitleChinese: "全部",
    //        displayTitleEnglish: "All",
    //        clickCount: 0,
    //        index: 0,
    //        createdAt: new Date()
    //    }, {
    //        name: "recommend",
    //        displayTitleChinese: "Zen推荐",
    //        displayTitleEnglish: "Recommended",
    //        clickCount: 0,
    //        index: 4,
    //        createdAt: new Date()
    //    }, {
    //        name: "shopping",
    //        displayTitleChinese: "买买买",
    //        displayTitleEnglish: "Shopping",
    //        clickCount: 0,
    //        index: 8,
    //        createdAt: new Date()
    //    }, {
    //        name: "game",
    //        displayTitleChinese: "游戏",
    //        displayTitleEnglish: "Game",
    //        clickCount: 0,
    //        index: 12,
    //        createdAt: new Date()
    //    }, {
    //        name: "education",
    //        displayTitleChinese: "趣学习",
    //        displayTitleEnglish: "Education",
    //        clickCount: 0,
    //        index: 14,
    //        createdAt: new Date()
    //    }, {
    //        name: "entertainment",
    //        displayTitleChinese: "娱乐",
    //        displayTitleEnglish: "Entertainment",
    //        clickCount: 0,
    //        index: 16,
    //        createdAt: new Date()
    //    }, {
    //        name: "productivity",
    //        displayTitleChinese: "效率工具",
    //        displayTitleEnglish: "Productivity",
    //        clickCount: 0,
    //        index: 18,
    //        createdAt: new Date()
    //    }, {
    //        name: "travel",
    //        displayTitleChinese: "出游",
    //        displayTitleEnglish: "Travel",
    //        clickCount: 0,
    //        index: 20,
    //        createdAt: new Date()
    //    }, {
    //        name: "lifestyle",
    //        displayTitleChinese: "生活方式",
    //        displayTitleEnglish: "Lifestyle",
    //        clickCount: 0,
    //        index: 24,
    //        createdAt: new Date()
    //    }, {
    //        name: "social",
    //        displayTitleChinese: "社交",
    //        displayTitleEnglish: "Social Network",
    //        clickCount: 0,
    //        index: 28,
    //        createdAt: new Date()
    //    }, {
    //        name: "news",
    //        displayTitleChinese: "新闻",
    //        displayTitleEnglish: "News",
    //        clickCount: 0,
    //        index: 32,
    //        createdAt: new Date()
    //    }, {
    //        name: "sports",
    //        displayTitleChinese: "体育",
    //        displayTitleEnglish: "Sports",
    //        clickCount: 0,
    //        index: 36,
    //        createdAt: new Date()
    //    }, {
    //        name: "business",
    //        displayTitleChinese: "办公",
    //        displayTitleEnglish: "Business",
    //        clickCount: 0,
    //        index: 40,
    //        createdAt: new Date()
    //    }];
    //
    //    initialCategories.map(function(zenCategory){
    //        ZenCategories.insert(zenCategory);
    //    });
    //}
});

