/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * colletion.js declares the meteor collections used by the app.
 *******************************************************************************/
const zenAppsStore = new FS.Store.GridFS("zenApps", {path: "~/zenApps"});
ZenApps = new FS.Collection("zenApps", {
  stores: [zenAppsStore]
});

const topicsStore = new FS.Store.GridFS("topics", {path: "~/topics"});
Topics = new FS.Collection("topics", {
  stores: [topicsStore]
});

UserApps = new Mongo.Collection("userApps");

UserAppCredentials = new Mongo.Collection("userAppCredentials");

ZenCategories = new Mongo.Collection("zenCategories");

//Account system configuration
Accounts.config({
  //Send email when account is created
  sendVerificationEmail: true,
  loginExpirationInDays: 1,
});