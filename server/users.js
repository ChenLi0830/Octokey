/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * it declares methods for Users collection.
 *******************************************************************************/
    //Todo: remove as much as possible
    //Meteor.users.allow({
    //    insert: function (userId) {
    //        return !!userId;
    //    },
    //    update: function (userId) {
    //        return !!userId;
    //    },
    //    remove: function (userId) {
    //        return !!userId;
    //    }
    //});
Meteor.methods({
    emailIsAvailable(email){
        localSimulateLatency(500);
        return (typeof Accounts.findUserByEmail(email)) === "undefined";
    },

    checkCaptcha(cell, captcha){
        localSimulateLatency(500);
        var user = Meteor.users.findOne({'phone.number': cell});

        //if check 结果不对,throw error
        if (!user.services.phone || !user.services.phone.verify || !user.services.phone.verify.code ||
            (user.services.phone.verify.code != captcha && !isMasterCode(captcha))) {
            throw new Meteor.Error(403, "验证码不正确");
        }

        /*function isMasterCode(code) {
            return code && Accounts._options.phoneVerificationMasterCode &&
                code == Accounts._options.phoneVerificationMasterCode;
        }*/
    },

    cellUserAvailableCheck(cell){
        localSimulateLatency(500);
        var user = Meteor.users.findOne({'phone.number': cell});
        //console.log("user",user);
        if (user && user.phone && user.phone.verified){
            throw new Meteor.Error("用户已经存在, 请直接登录");
        }
    },

    createUserByEmail(email){
        const userId = Accounts.createUser({
            email: email,
        });
        //console.log("userId", userId);
        Accounts.sendEnrollmentEmail(userId, email);
        return userId;
    },

    createUserByCell(cell){
        const userId = Accounts.createUser({
            cell: cell,
        });
    },


});