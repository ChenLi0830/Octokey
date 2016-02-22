/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * startUp.js calls the startup function, it runs before everything else,
 * and can be used to set environment variables in the app, or setup database, etc.
 *******************************************************************************/
Meteor.startup(function () {
    //1. Set up stmp
    process.env.MAIL_URL =
        'smtp://postmaster@sandbox4e97a79afccd430d8897f90ad78054be.mailgun.org:0011d852303b11544220c77d6572bc1d@smtp.mailgun.org:587';

    setupEmail();
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

    function setupEmail() {
        // 2. Format the email
        //-- Set the from address
        Accounts.emailTemplates.from = "章鱼钥匙 <no-reply@zhangyuyaoshi.com>";

        //-- Application name
        Accounts.emailTemplates.siteName = '章鱼钥匙';

        //-- Subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function (user) {
            //return 'Confirm Your Email Address for Octokey';
            return '验证Email地址 - 章鱼钥匙';
        };

        /***********-- Email text ************/
        //Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        //    return 'Thank you for registering.  Please click on the following link to verify your email address:
        // \r\n' + url; };

        /*********** -- Email html ***********/
            //const hello = Assets.getText('verifyEmail.html');
        SSR.compileTemplate('verifyEmail', Assets.getText('verifyEmail.html'));

        /*Template.verifyEmail.helpers({
            time: function () {
                return new Date().toString();
            }
        });*/

        Accounts.emailTemplates.verifyEmail.html = function (user, url) {
            const html = SSR.render("verifyEmail", {username: user, verifyUrl:url});
            return html;
        };

        //    function(user,url){
        //    //console.log("user",user);
        //    return "<h1>Thanks for signing up!</h1>"
        //        + " To <strong>activate</strong> your account, click the link below:\n\n"
        //        + url;
        //}


        // 4.  set url (account-password's default url has # in it, which conflicts with react-router)
        Accounts.urls.resetPassword = function (token) {
            return Meteor.absoluteUrl('reset-password/' + token);
        };

        Accounts.urls.verifyEmail = function (token) {
            return Meteor.absoluteUrl('verify-email/' + token);
        };

        Accounts.urls.enrollAccount = function (token) {
            return Meteor.absoluteUrl('enroll-account/' + token);
        };

        // 4.  Send email when account is created
        Accounts.config({
            sendVerificationEmail: true
        });
    }
});

