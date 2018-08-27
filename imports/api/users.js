/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * It declares the methods for Users collection.
 *******************************************************************************/
 import {OctoServerAPI} from "./lib/OctoServerApi.jsx";

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

  /**
   * Check if the cellphone number is registered
   * @param {string} cell 
   */
  cellUserAvailableCheck(cell){
    localSimulateLatency(500);
    var user = Meteor.users.findOne({'phone.number': cell});
    //console.log("user",user);
    if (user && user.phone && user.phone.verified) {
      throw new Meteor.Error("用户已经存在, 请直接登录");
    }
  },

  /**
   * Create user using Email and initiate its data
   * @param {string} email
   * @returns {string} userId
   */
  createUserByEmail(email){
    const userId = Accounts.createUser({
      email: email,
    });
    //console.log("userId", userId);
    Accounts.sendVerificationEmail(userId, email);
    return userId;
  },

  /**
   * Mark user as verified and set its master password
   * @param {string} mobile - The mobile number of user.
   * @param {string} captcha - The captcha input by user.
   * @param {string} pwd - The to-be-assigned master password.
   */
  setMobilePassword(mobile, captcha, newPassword){
    Meteor.call("verifyPhone", mobile, captcha, newPassword, function (error) {
      if (error) {
        throw new Meteor.Error("error", error);
      }
    });
  },

  /**
   * Set user's master password using its email
   * @param {string} userEmail - The email user used to register.
   * @param {string} password - The to-be-assigned master password.
   * @param {function} callback
   */
  setEmailPassword(userEmail, password){
    var user = Accounts.findUserByEmail(userEmail);
    if (user === null) {
      throw new Meteor.Error("无法找到与邮箱对应的用户");
    }
    Accounts.setPassword(user._id, password);
    OctoServerAPI.initiateUserById(user._id);
  },
});