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

    sendVerifyCode(cell){
        //console.log("cell",cell);
        //var userPhone = "+17097490481";
        //// Request for sms phone verification -- please note before receiving SMS you should Follow the SMS Integration tutorial below
        //Accounts.requestPhoneVerification(userPhone, function(){
        //    console.log("finish sending text to "+userPhone);
        //});
        //Debug:  Verify the user phone isn't confirmed it.
        console.log('Phone verification status is :', Accounts.isPhoneVerified());
    }
});