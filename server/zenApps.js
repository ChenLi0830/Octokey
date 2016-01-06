ZenApps.deny({
  download: function(){
    return false;
  }
});

ZenApps.allow({
  download: function(){
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
  addZenApp(appName, loginLink, logo){
    console.log("appName",appName);
    console.log("loginLink",loginLink);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }

    if (Meteor.user().emails[0].address != "lulugeo.li@gmail.com"){
      throw new Meteor.Error("This user is not authorized to do so");
    }

    let app = new FS.File(logo);
    app.appName = appName;
    app.loginLink = loginLink;

    //Todo: change this to use a method
    ZenApps.insert(app, function (err, fileObj) {
      if (err) {
        console.log("there was an error", err);
      } else {//Logo uploaded successful
        //let imagesURL = "/cfs/files/logos/"+fileObj._id;
        console.log("insert app successfully");
      }
    });
  }
});