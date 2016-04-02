/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * it declares methods for ZenApps collection. (Public Apps)
 *******************************************************************************/
ZenApps.deny({
  download: function () {
    return false;
  }
});

ZenApps.allow({
  download: function () {
    return true;
  }
});

/*ZenApps.allow({
 download:function(){
 console.log("this.user()",this.user());
 return this.user();
 }
 });*/
const MAX_APPS = 1000;

Meteor.methods({
  searchApps(searchText){
    checkUserLogin();

    console.log("searchText", searchText);
    const result = ZenApps.find({"appName": {$regex: "^" + searchText, $options: "i"}}).fetch();
    console.log("result.length", result.length);
    return result;
  },

  getPublicAppsOfCategory(categoryName, limit){
    localSimulateLatency(500);
    //console.log("limit for all apps",limit);
    const options = {
      sort: {subscribeCount: -1},
      limit: Math.min(limit, MAX_APPS)
    };
    if (this.userId) {
      return ZenApps.find({
        categoryNames: {
          $in: [categoryName]
        }
      }, options).fetch();
    }
  },

  getAllPublicApps(){
    localSimulateLatency(800);
    //console.log("getAllPublicApps is called");
    if (this.userId) {
      return ZenApps.find({}, {sort: {subscribeCount: -1}}).fetch();
    }
  },

  addZenApp(appName, loginLink, registerLink, logo, selectedCategoryNames){
    localSimulateLatency(500);
    //console.log("appName", appName);
    //console.log("loginLink", loginLink);

    checkUserLogin();
    checkAdmin();

    let app = new FS.File(logo);
    app.appName = appName;
    app.loginLink = loginLink;
    app.registerLink = registerLink;
    app.categoryNames = selectedCategoryNames;
    app.subscribeCount = 0;

    //console.log("add new app", app);
    //Todo: change this to use a method
    ZenApps.insert(app, function (err, fileObj) {
      if (err) {
        console.log("there was an error", err);
      } else {//Logo uploaded successful
        //let imagesURL = "/cfs/files/logos/"+fileObj._id;
        console.log("insert app successfully");
      }
    });
  },

  updateZenApp(appId, appName, loginLink, registerLink, logo, selectedCategoryNames){
    localSimulateLatency(500);
    /*console.log("update start: appId", appId, "appName", appName, "loginLink", loginLink, "selectedCategoryNames",
     selectedCategoryNames, "registerLink", registerLink);*/

    checkUserLogin();
    checkAdmin();

    let existingApp = ZenApps.findOne({_id: appId});
    //console.log("existingApp", existingApp);

    if (!existingApp) {
      throw new Meteor.Error("No existing App matches appId", appId);
    }

    //注意,新上传的logo对应是一个文件,而已经存在的logo对应是一个path string
    if (logo.indexOf("cfs/files/zenApps") > -1) {//Update data only
      let updatedApp = existingApp;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.registerLink = registerLink;
      updatedApp.categoryNames = selectedCategoryNames;
      ZenApps.update({_id: appId}, updatedApp);
      updateUserApps(appId);
    }
    else {//Update logo as well
      let updatedApp = new FS.File(logo);
      updatedApp._id = appId;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.registerLink = registerLink;
      updatedApp.categoryNames = selectedCategoryNames;
      updatedApp.subscribeCount = existingApp.subscribeCount ? existingApp.subscribeCount : 0;
      //console.log("updatedApp", updatedApp);

      ZenApps.remove({_id: appId}, function (err) {
        if (err) console.log("there was an error removing zenApp when updating this app:", err);
        //When is app is removed successfully, insert the new app
        ZenApps.insert(updatedApp, function (err) {
          if (err) console.log("there was an error inserting zenApp when updating this app:", err);
        });
      });
    }

    function updateUserApps(appId) {
      let ids = UserApps.find({"publicApps.appId": appId}).map(function (publicApp) {
        return publicApp.userId;
      });
      //console.log(ids);
      UserApps.update({
            $and: [
              {userId: {$in: ids}},
              {"publicApps.appId": appId}
            ]
          },
          {
            $set: {
              "publicApps.$.appName": appName,
              "publicApps.$.loginLink": loginLink,
            }
          },
          {multi: true}
      );
    };
  },

  removeZenApp(appId){
    localSimulateLatency(500);
    checkUserLogin();
    checkAdmin();
    ZenApps.remove({_id: appId});
  }
});