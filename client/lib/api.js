/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Global functions used by client
 *******************************************************************************/
getLogoUrl = function(appId) {
    return "cfs/files/zenApps/" + appId
};

isAdmin = function(user) {//TODO use more scalable solution to configure this, i.e.: role system
    return user && user.emails[0].address == "lulugeo.li@gmail.com"
}