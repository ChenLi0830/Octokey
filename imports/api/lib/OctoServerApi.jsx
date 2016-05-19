/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * OctoServerAPI contains the global methods that are used by the server
 *******************************************************************************/

/**
 * Simulate a latency when running meteor locally
 * @param {number} millisec - The time to wait in millisecond.
 */
localSimulateLatency = function (millisec) {
  if (/localhost/.test(Meteor.absoluteUrl())) {
    //The following line should be commented when using a remove database
    //Meteor._sleepForMs(millisec); //to simulate response sleep only on localhost
  }
};

/**
 * Check if user is logged in, throw an error if not. Since it use this.userId, remember to add
 * .call(this) when invoking it.
 */
checkUserLogin = function () {
  //这里不是在method里直接调用,为了保险不用this.userId
  if (!this.userId) {
    throw new Meteor.Error("not logged in");
  }
};

/**
 * Check if user is logged in, and check if the logged in user is an admin. Throw an error if
 * not. Since it use this.userId, remember to add .call(this) when invoking it.
 */
checkAdmin = function () {//TODO use more scalable solution to configure this, i.e.: role system
  checkUserLogin.call(this);
  const user = Meteor.users.findOne(this.userId);
  const admins = ["lulugeo.li@gmail.com", "yekiki@gmail.com"];
  if ((user && user.emails && user.emails[0] &&
      (user.emails[0].address === admins[0] || user.emails[0].address === admins[1])) === false) {
    console.log("not admin");
    throw new Meteor.Error("This can only be done by administrator");
  }
};

isValidateEmail = function (email) {//检查邮箱格式
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

isValidateCell = function (area, number) {
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

//Phone verification methods
isMasterCode = function (code) {
  return code && Accounts._options.phoneVerificationMasterCode &&
      code == Accounts._options.phoneVerificationMasterCode;
};

export const OctoServerAPI = {

  /**
   * initial user's collections
   * @param {string} userId - The id of the to-be-initiated user
   */
  initiateUserById(userId){
    //Only insert empty documents if it hasn't been initiated before
    if (UserApps.find({_id: userId}).count() === 0) {
      UserApps.insert({
        userId: userId,
        publicApps: [],
        privateApps: []
      });
    }

    if (UserAppCredentials.find({_id: userId}).count() === 0) {
      UserAppCredentials.insert({
        userId: userId,
        publicApps: [],
        privateApps: []
      });
    }
  },
};
