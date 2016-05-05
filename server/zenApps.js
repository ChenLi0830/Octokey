/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * it declares methods for ZenApps collection. (Public Apps)
 *******************************************************************************/
ZenApps.allow({
  download: function () {
    //checkUserLogin();
    return true;
  }
});

ZenApps.deny({
  download: function () {
    return false;
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
  /**
   * Search public app by appName, compared from the beginning of appName.
   * @param {string} searchText - The string used to search for the app.
   * @returns {Object[]} result - The search result.
   */
  searchApps(searchText){
    checkUserLogin.call(this);
    const result = ZenApps.find({"appName": {$regex: "^" + searchText, $options: "i"}}).fetch();
    //console.log("result.length", result.length);
    return result;
  },

  /**
   * Fetch a certain number of publicApps of from a specific category
   * @param {string} categoryName - The string used to search for the app.
   * @param {number} limit - The string used to search for the app.
   * @returns {{total: number, apps: Object[]}} - The search result.
   */
  getPublicAppsOfCategory(categoryName, limit){
    localSimulateLatency(500);
    checkUserLogin.call(this);
    //console.log("limit for all apps",limit);
    const options = {
      sort: {subscribeCount: -1},
      limit: Math.min(limit, MAX_APPS)
    };
    const query = {
      categoryNames: {
        $in: [categoryName]
      }
    };
    const total = ZenApps.find(query).count();
    const apps = ZenApps.find(query, options).fetch();

    return {total:total, apps:apps};
  },

  /**
   * Fetch all public apps
   * @returns {Object[]} - The search result.
   */
  getAllPublicApps(){
    localSimulateLatency(800);
    //console.log("getAllPublicApps is called");
    if (this.userId) {
      return ZenApps.find({}, {sort: {subscribeCount: -1}}).fetch();
    }
  },

  /**
   * Add a new public app
   * @param {string} appName - App name.
   * @param {string} loginLink - Login link
   * @param {string} registerLink - Register link
   * @param {string} logo - Logo file, encoded in base64
   * @param {string[]} selectedCategoryNames - The category names which of the added app belongs to.
   * @param {bool} popUpLoginFlag  - flag whether the user needs to click "登录" before actually
   * fill in credentials
   * @param {string} homepageLink - Home page link
   */
  addPublicApp(appName, loginLink, registerLink, logo, selectedCategoryNames, popUpLoginFlag, homepageLink){
    localSimulateLatency(500);

    checkAdmin.call(this);
    var noLogo = false;
    //return;
    if (logo.length===0){
      logo="data:image/noFile;base64,";
      noLogo = true;
    }

    let app = new FS.File(logo);
    console.log("app",app);
    app.appName = appName;
    app.loginLink = loginLink;
    app.registerLink = registerLink;
    app.categoryNames = selectedCategoryNames;
    app.popUpLoginFlag = popUpLoginFlag;
    app.homepageLink = homepageLink;
    app.subscribeCount = 0;
    app.noLogo = noLogo;

    //console.log("add new app", app);
    //Todo: change this to use a method
    ZenApps.insert(app, function (error, fileObj) {
      if (error) {
        throw new Meteor.Error(error);
      } else {//Logo uploaded successful
        //console.log("added app: ", fileObj);
        let imagesURL = "/cfs/files/logos/"+fileObj._id;
        console.log("insert app successfully, imageURL="+imagesURL);
      }
    });
  },

  /**
   * Update a new public app
   * @param {string} appId - Id of the to-be-updated app.
   * @param {string} appName - App name.
   * @param {string} loginLink - Login link
   * @param {string} registerLink - Register link
   * @param {string} logo - Logo file, encoded in base64
   * @param {string[]} selectedCategoryNames - The category names which of the added app belongs to.
   * @param {bool} popUpLoginFlag - flag whether the user needs to click "登录" before actually
   * fill in credentials
   * @param {string} homepageLink - Home page link
   */
  updatePublicApp(appId, appName, loginLink, registerLink, logo, selectedCategoryNames, popUpLoginFlag, homepageLink){
    localSimulateLatency(500);

    checkAdmin.call(this);

    let existingApp = ZenApps.findOne({_id: appId});
    //console.log("existingApp", existingApp);
    if (!existingApp) {
      throw new Meteor.Error("No existing App matches appId", appId);
    }

    //注意,新上传的logo对应是string encoded in base64,而已经存在的logo对应是一个path string
    if (logo.indexOf("cfs/files/zenApps") > -1) {// Logo is not changed: update existing app object
      let updatedApp = existingApp;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.registerLink = registerLink;
      updatedApp.categoryNames = selectedCategoryNames;
      updatedApp.popUpLoginFlag = popUpLoginFlag;
      updatedApp.homepageLink = homepageLink;
      updatedApp.noLogo = false;
      ZenApps.update({_id: appId}, updatedApp);
    }
    else {// Logo is new: remove old app object and add a new one.
      var noLogo=false;
      if (logo.length===0){//如果没有logo
        logo="data:image/noFile;base64,";
        noLogo = true;
        //Todo 用imageToBase64来转image,而不是直接用一个string
        /*OctoServerAPI.toDataUrl('http://bit.ly/18g0VNp', function(base64Img){
         logo = base64Img;
         createAppAndInsert()
         });*/
      }
      let updatedApp = new FS.File(logo);
      updatedApp._id = appId;
      updatedApp.appName = appName;
      updatedApp.loginLink = loginLink;
      updatedApp.registerLink = registerLink;
      updatedApp.categoryNames = selectedCategoryNames;
      updatedApp.popUpLoginFlag = popUpLoginFlag;
      updatedApp.homepageLink = homepageLink;
      updatedApp.noLogo = noLogo;
      updatedApp.subscribeCount = existingApp.subscribeCount ? existingApp.subscribeCount : 0;
      //console.log("updatedApp", updatedApp);

      ZenApps.remove({_id: appId});
      ZenApps.insert(updatedApp);
    }
    //Update user Apps. 没有callback的collection操作都是sync的,所以前面的操作结束后才会运行这个操作.
    Meteor.call("updateUserApps", appId);
  },

  /**
   * Remove public app by app ID.
   * @param {string} appId - App Id.
   */
  removePublicApp(appId){
    localSimulateLatency(500);
    checkAdmin.call(this);
    ZenApps.remove({_id: appId});
  },

  /**
   * Check if an public app exists by appId
   * @param {string} appId - App Id.
   * @returns {Object} - returns true if a public app with the same appId exist and false if it
   * does not.
   */
  checkAppExistsById(appId){
    checkUserLogin.call(this);
    return ZenApps.findOne({_id: appId});
  },

  /**
   * Check if an public app exists by appId
   * @param {string} appId - App Id.
   * @returns {Object} - returns true if a public app with the same appId exist and false if it
   * does not.
   */
  checkAppExistsByName(appName){
    checkUserLogin.call(this);
    return ZenApps.findOne({appName: appName});
  },
});