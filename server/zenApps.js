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

Meteor.methods({
  addZenApp(appName, loginLink, logo, selectedCategoryNames){
    console.log("appName", appName);
    console.log("loginLink", loginLink);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }

    if (Meteor.user().emails[0].address != "lulugeo.li@gmail.com") {
      throw new Meteor.Error("This user is not authorized to do so");
    }

    let app = new FS.File(logo);
    app.appName = appName;
    app.loginLink = loginLink;
    app.categoryNames = selectedCategoryNames;

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

  updateZenApp(appId, appName, loginLink, logo, selectedCategoryNames){
    //console.log("appName",appName);
    //console.log("loginLink",loginLink);
    console.log("update start: appId", appId, "appName", appName, "loginLink", loginLink, "selectedCategoryNames",
      selectedCategoryNames);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }

    if (Meteor.user().emails[0].address != "lulugeo.li@gmail.com") {
      throw new Meteor.Error("This user is not authorized to do so");
    }

    let existingApp = ZenApps.findOne({_id: appId});
    console.log("existingApp", existingApp);

    if (!existingApp){
      throw new Meteor.Error("No existing App matches appId", appId);
    }

    //注意,新上传的logo对应是一个文件,而已经存在的logo对应是一个path string
    if (logo.indexOf("cfs/files/zenApps")> -1) {//Update data only
      let updatedApp = existingApp;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.categoryNames = selectedCategoryNames;
      ZenApps.update({_id:appId},updatedApp);
    }
    else {//Update logo as well
      let updatedApp = new FS.File(logo);
      updatedApp._id = appId;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.categoryNames = selectedCategoryNames;
      //console.log("updatedApp", updatedApp);

      ZenApps.remove({_id:appId}, function(err){
        if (err) console.log("there was an error removing zenApp when updating this app:",err);
      });
      ZenApps.insert(updatedApp, function(err){
        if (err) console.log("there was an error inserting zenApp when updating this app:",err);
      });
    }

    //Todo update all users' reference on this ZenApp (logo 会自动更新,其他的需要写算法更新)
  },

  removeZenApp(appId){
    ZenApps.remove({_id:appId});
  }
});