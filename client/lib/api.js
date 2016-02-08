/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Global functions used by client
 *******************************************************************************/
var CryptoJS = require('crypto-js');



getLogoUrl = function (appId) {
    return "cfs/files/zenApps/" + appId
};

isAdmin = function (user) {//TODO use more scalable solution to configure this, i.e.: role system
    return user && user.emails[0].address == "lulugeo.li@gmail.com"
};

encrypt = function (inputData, hexKey, hexIv) {
    var rawEnc = CryptoJS.AES.encrypt(inputData,
        CryptoJS.enc.Hex.parse(hexKey),
        {iv: CryptoJS.enc.Hex.parse(hexIv), mode: CryptoJS.mode.CBC});

    var cipherText = CryptoJS.enc.Hex.stringify(rawEnc.ciphertext);
    return cipherText;
};

