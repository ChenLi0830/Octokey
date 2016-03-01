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
    const admins = ["lulugeo.li@gmail.com", "yekiki@gmail.com"];
    return user && _.indexOf(admins, user.emails[0].address)>-1
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