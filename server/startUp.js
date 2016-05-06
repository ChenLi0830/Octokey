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
  //Simulating production environment to boost react spped
  /*process.env.NODE_ENV = JSON.stringify('production');
   console.log("process.env",process.env);*/

  //1. Set up stmp

  //如果是localhost,发邮件就用mailgun,如果是server,就用aliyun
  //console.log("/localhost/.test(Meteor.absoluteUrl())", /localhost/.test(Meteor.absoluteUrl()));
  process.env.MAIL_URL = /localhost/.test(Meteor.absoluteUrl()) ?
      'smtp://postmaster@sandbox4e97a79afccd430d8897f90ad78054be.mailgun.org:0011d852303b11544220c77d6572bc1d@smtp.mailgun.org:587':
      'smtp://no-reply@mail.oyaoshi.com:Oyaoshifour21@smtpdm.aliyun.com:25/';
  //smtp://USERNAME:PASSWORD@HOST:PORT/

  setupEmail();
  setupSMS();
  configAccountsPackage();
  initDatabase();

  function setupEmail() {
    // 2. Format the email
    //-- Set the from address
    Accounts.emailTemplates.from = "O钥匙<no-reply@mail.oyaoshi.com>";

    //-- Application name
    Accounts.emailTemplates.siteName = 'O钥匙';

    //-- Subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
      //return 'Confirm Your Email Address for Octokey';
      return '验证Email地址 - O钥匙';
    };

    /***********-- Email text ************/
    //Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    //    return 'Thank you for registering.  Please click on the following link to verify your
    // email address: \r\n' + url; };

    /*********** -- Email html ***********/
      //const hello = Assets.getText('verifyEmail.html');
    SSR.compileTemplate('verifyEmail', Assets.getText('verifyEmail.html'));

    Accounts.emailTemplates.verifyEmail.html = function (user, url) {
      const html = SSR.render("verifyEmail", {username: user, verifyUrl: url});
      return html;
    };

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
  }

  function setupSMS() {
    SMS.twilio = {
      FROM: '+16502156909',
      ACCOUNT_SID: 'AC0df36c73c7f3d564de6ecfdf119e300f',
      AUTH_TOKEN: '1913b8c1168e2eb3629ceecfd1243791'
    };

    SMS.phoneTemplates = {
      from: '+16502156909',
      text: function (user, code) {
        return "【O钥匙】https://oyaoshi.com 您的验证码是#"+ code+"#。如非本人操作，请忽略本短信"
      }
    };

    Accounts._options.verificationRetriesWaitTime = 60 * 60 * 1000;
    Accounts._options.verificationWaitTime = 50 * 1000;
    Accounts._options.verificationCodeLength = 4;
    Accounts._options.verificationMaxRetries = 6;
    Accounts._options.forbidClientAccountCreation = false;
    Accounts._options.sendPhoneVerificationCodeOnCreation = true;
  }

  function configAccountsPackage() {
    Accounts.validateNewUser(function (user) {
      //Todo 在这里check新建的user
      /*if (user.emails) {
       if (isValidateEmail(user.emails[0].address)) return true;
       throw new Meteor.Error(403, "邮件格式出错");
       }
       if (user.emails) {
       if (isValidateEmail(user.emails[0].address)) return true;
       throw new Meteor.Error(403, "邮件格式出错");
       }*/
      return true;
    });

    //Stop autoLogin for certain methods
    Accounts.validateLoginAttempt(function (info) {
      const methodName = info.methodName;
      //console.log("login attempt "+methodName);
      if (methodName === "verifyEmail") {
        return false;
      }
      return true;
    });
  }

  function initDatabase() {
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
  }
});

