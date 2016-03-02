/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * ServerApi contains the global api that is used by the server
 *******************************************************************************/
localSimulateLatency = function (millisec) {
    if (/localhost/.test(Meteor.absoluteUrl())) {
        Meteor._sleepForMs(millisec); //to simulate response sleep only on localhost
    }
};

checkUserLogin = function () {
    if (!Meteor.userId()) {
        throw new Meteor.Error("not logged in");
    };
};

checkAdmin = function () {//TODO use more scalable solution to configure this, i.e.: role system
    const user = Meteor.user();
    const admins = ["lulugeo.li@gmail.com", "yekiki@gmail.com"];
    if ((user && (user.emails[0].address === admins[0] || user.emails[0].address === admins[1])) === false) {
        throw new Meteor.Error("This can only be done by administrator");
    }
};

isValidateEmail = function(email) {//检查邮箱格式
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

isValidateCell = function(area, number){
    //Todo 修正server端的isValidateCell
    return true;
    //const val = number.value;
    //console.log("val",val);
    //switch (area){
    //    case "cn":
    //        return (/^\d{11}$/.test(number));
    //        break;
    //    case "ca":
    //    case "us":
    //        return (/^\d{10}$/.test(number));
    //        break;
    //}
};
