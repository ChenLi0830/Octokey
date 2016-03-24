/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Global functions used by client
 *******************************************************************************/
var CryptoJS = require('crypto-js');

/** @global */
OctoAPI = {
    /**
     * Save a credential of an app on the database for the current user
     * @param {string} appId - The id of the app
     * @param {string} hexIv - Initial Vector, argument for encryption algorithm
     * @param {string} username
     * @param {string} password
     * @param {boolean} isPublicApp - Whether this app is a public app
     */
    saveCredential: function (appId, hexIv, username, password, isPublicApp) {
        //console.log("appId, hexIv, username, password, isPublicApp",appId, hexIv, username, password, isPublicApp);
        let hexKey = Session.get("hexKey");
        if (!hexKey) throw Error("Can't find master password key");
        let encryptedPwd = this.encrypt(password, hexKey, hexIv);
        if (isPublicApp) {
            Meteor.call("addNewCredential", appId, username, encryptedPwd, function (error) {
                if (error) {
                    throw new Error("Error adding new Credential");
                }
            }.bind(this));

            Meteor.call("appAddUsername", appId, username, function (error) {
                if (error) {
                    throw new Error("Error adding new Credential");
                }
            }.bind(this));
            //Todo this return doesn't do anything since meteor call is asynchronous, fix it later.
            return true;
        } else {
            alert("TODO: adding credentials for the private app");
            //Todo this return doesn't do anything since meteor call is asynchronous, fix it later.
            return false;
        }
    },

    /**
     * Remove a credential of an app from database for the current user
     * @param {string} appId - the id of the app
     * @param {string} username - the username of the credential that need to be removed
     */
    removeCredential: function (appId, username) {
        Meteor.call("removeCredential", appId, username, this.handleMeteorError);
        Meteor.call("appRemoveUsername", appId, username, this.handleMeteorError);
    },

    /**
     * Get the Logo URL of of an app
     * @param {string} appId
     * @returns {string} Logo URL
     */
    getLogoUrl: function (appId) {
        return "cfs/files/zenApps/" + appId
    },

    /**
     * Encrypt input data using AES256
     * @param {string} inputData - Data to be encrypted
     * @param {string} hexKey - Encryption key
     * @param {string} hexIv - Initial Vector, from database
     * @returns {string} Encrypted data
     */
    encrypt: function (inputData, hexKey, hexIv) {
        var rawEnc = CryptoJS.AES.encrypt(inputData,
            CryptoJS.enc.Hex.parse(hexKey), {iv: CryptoJS.enc.Hex.parse(hexIv), mode: CryptoJS.mode.CBC});

        var cipherText = CryptoJS.enc.Hex.stringify(rawEnc.ciphertext);
        return cipherText;
    },

    /**
     * Check if a user is an admin
     * @param {Object} user
     * @returns {boolean} Whether the user is an admin
     */
    isAdmin: function (user) {//TODO use more scalable solution to configure this, i.e.: role system
        if (!user || !user.emails || !user.emails[0] || !user.emails[0].address) {
            return false;
        }
        const admins = ["lulugeo.li@gmail.com", "yekiki@gmail.com"];
        return user && _.indexOf(admins, user.emails[0].address) > -1
    },

    /**
     * A quick error handler for Meteor Methods
     * @param {Object} error
     */
    handleMeteorError: function (error) {
        if (error) {
            throw new Meteor.Error(error.error);
        }
    },

    /**
     * Check if a email address is valid
     * @param {string} email
     * @returns {boolean} - Whether the email is valid
     */
    isValidateEmail: function (email) {//检查邮箱格式
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    /**
     * Check if a number is valid
     * @param {string} area - area code
     * @param {string} number - number to be checked
     * @returns {boolean} - Whether the number is valid
     */
    isValidateCell: function (area, number) {
        switch (area) {
            case "cn":
                return (/^\d{11}$/.test(number));
                break;
            case "ca":
            case "us":
                return (/^\d{10}$/.test(number));
                break;
        }
    },

    /**
     * Check if a password is strong enough
     * @param {string} pass - The password to be checked
     * @returns {boolean} - Whether the password is strong enough
     */
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
    },

    /**
     * Fetch static (non-reactive) Meteor data to Session using Meteor method
     * @param {string} dataName - The result returned from Meteor method will be called this name in Session
     * @param {string} methodName - The name of the Meteor method to conduct data fetching
     * @param {*} [arg1, arg2, ...] The arguments used in the Meteor method
     */
    fetchDataToSession: function () {
        //When passing arguments from fetchDataToSessionIfNull, the original arguments will be stored as arguments[0]
        if (typeof arguments[0] === "object") {
            arguments = arguments[0];
        }

        const dataName = arguments[0];
        const methodName = arguments[1];
        var methodArgs = Array.prototype.slice.call(arguments, 2);

        Meteor.apply(methodName, methodArgs, function (error, retrievedData) {
            if (error) {
                console.log(error);
            } else {
                //console.log("dataName, retrievedData", dataName, retrievedData);
                Session.setAuth(dataName, retrievedData);
            }
        }.bind(this));
    },

    /**
     * If a Session variable is null, fetch this static (non-reactive) Meteor data to Session using Meteor method.
     * @param {string} dataName - The result returned from Meteor method will be called this name in Session
     * @param {string} methodName - The name of the Meteor method to conduct data fetching
     * @param {*} [arg1, arg2, ...] The arguments used in the Meteor method
     */
    fetchDataToSessionIfNull: function () {
        const dataName = arguments[0];
        if (!Session.get(dataName)) {
            //console.log("dataName, methodName", dataName, arguments[1]);
            //console.log("arguments",arguments);
            this.fetchDataToSession(arguments);
        }
    },

    /**
     * Check if all the subscriptions from Meteor are ready
     * @param {Object[]} subsHandles - array of Meteor.subscribe() or Session.get()
     */
    subsHandlesAreReady: function (subsHandles) {
        return _.every(subsHandles, function (subsHandle) {
            if (subsHandle && subsHandle.ready) {//Meteor.subscribe()
                return subsHandle.ready();
            }
            else {//Session.get()
                return subsHandle !== undefined;
            }
        });
    },

    /**
     * Callback for CheckImageFile, handle error && make use of the image file
     * @callback CheckImageFileCB
     * @param {Object} error
     * @param {Object} Image file
     */

    /**
     * Check uploaded logo's format, size and height && width
     * @param {Blob} logoFile - The logo file object
     * @param {CheckImageFileCB} callback
     */
    checkImageFile: function (logoFile, callback) {
        if (logoFile.type !== "image/png") {
            callback(new Error("Only png file can be accepted"), null);
            return;
        }

        if (logoFile.size > 100 * 1000) {
            callback(new Error("Image size must be less than 100KB"), null);
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(logoFile);

        reader.onloadend = function (theFile) {
            var image = new Image();
            image.src = theFile.target.result;
            image.onload = function () {
                if (this.width > 200 || this.height > 200) {
                    callback(new Error("Image height && width should both be less than 200px"), null);
                    return;
                }
                callback(null, theFile.target.result);
            };
        };
    }
};