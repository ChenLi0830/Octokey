/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * "generalMethods" declares the methods that is not related to any specific collection
 *******************************************************************************/
Meteor.methods({
  inDevMode(){
    localSimulateLatency(500);
    return process.env.NODE_ENV === "development";
  },

  initiateUser(){
    localSimulateLatency(1000);
    checkUserLogin.call(this);
    const userId = this.userId;
    console.log("initiateUser userId", userId);
    OctoServerAPI.initiateUserById(userId);
  }
});