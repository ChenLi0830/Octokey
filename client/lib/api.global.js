/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Global functions used by client
 *******************************************************************************/
var CryptoJS = require('crypto-js');

saveCredential = function (appId, hexIv, username, password, isPublicApp) {
    //console.log("appId, hexIv, username, password, isPublicApp",appId, hexIv, username, password, isPublicApp);
    let hexKey = Session.get("hexKey");
    if (!hexKey) throw Meteor.Error("Can't find master password key");
    let encryptedPwd = encrypt(password, hexKey, hexIv);
    if (isPublicApp) {
        Meteor.call("addNewCredential", appId, username, encryptedPwd, function (error) {
            if (error) {
                throw new Meteor.Error("Error adding new Credential");
            }
        }.bind(this));

        Meteor.call("appAddUsername", appId, username, function (error) {
            if (error) {
                throw new Meteor.Error("Error adding new Credential");
            }
        }.bind(this));
        return true;
    } else {
        alert("TODO: adding credentials for the private app");
        return false;
    }
};

removeCredential = function (appId, username) {
    Meteor.call("removeCredential", appId, username, handleError);
    Meteor.call("appRemoveUsername", appId, username, handleError);
},

    getLogoUrl = function (appId) {
        return "cfs/files/zenApps/" + appId
    };

isAdmin = function (user) {//TODO use more scalable solution to configure this, i.e.: role system
    if (!user || !user.emails || !user.emails[0] || !user.emails[0].address) {
        return false;
    }

    const admins = ["lulugeo.li@gmail.com", "yekiki@gmail.com"];
    return user && _.indexOf(admins, user.emails[0].address) > -1
};

encrypt = function (inputData, hexKey, hexIv) {
    var rawEnc = CryptoJS.AES.encrypt(inputData,
        CryptoJS.enc.Hex.parse(hexKey),
        {iv: CryptoJS.enc.Hex.parse(hexIv), mode: CryptoJS.mode.CBC});

    var cipherText = CryptoJS.enc.Hex.stringify(rawEnc.ciphertext);
    return cipherText;
};

handleError = function (error) {
    if (error) {
        throw new Meteor.Error(error.error);
    }
};

validateEmail = function (email) {//检查邮箱格式
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

isValidateCell = function (area, number) {
    switch (area) {
        case "cn":
            return (/^\d{11}$/.test(number));
            break;
        case "ca":
        case "us":
            return (/^\d{10}$/.test(number));
            break;
    }
};

OctoAPI = {
    checkPassword: function (pass) {
        //let score = 0;
        if (!pass)
            return false;

        // award every unique letter until 5 repetitions
        /*let letters = new Object();
         for (let i=0; i<pass.length; i++) {
         letters[pass[i]] = (letters[pass[i]] || 0) + 1;
         score += 5.0 / letters[pass[i]];
         }*/

        // bonus points for mixing it up
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            //nonWords: /\W/.test(pass),
        };

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        //score += (variationCount - 1) * 10;

        return variationCount >= 2 && pass.length > 6;
    }
}