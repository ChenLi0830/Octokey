/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * colletion.js declares the meteor collections used by the app.
 *******************************************************************************/
const zenAppsStore = new FS.Store.GridFS("zenApps", {path: "~/zenApps"});
ZenApps = new FS.Collection("zenApps", {
    stores: [zenAppsStore]
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