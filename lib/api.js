getLogoUrl = function (appId) {
    return "cfs/files/zenApps/" + appId
};

isAdmin = function (user) {//TODO use more scalable solution to configure this, i.e.: role system
    return user && user.emails[0].address == "lulugeo.li@gmail.com"
}