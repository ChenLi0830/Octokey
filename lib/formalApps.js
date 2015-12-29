// Define a collection to hold our tasks
FormalApps = new Mongo.Collection("formalApps");

//TODO add methods for formalApps
//add new app
//update app (logo, link)
//get app(app._id)
Meteor.methods({
  addApp(logo, link){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not signed in");
    } else if (Meteor.user().username!="lulugeo.li@gmail.com"){//TODO change it using role
      throw new Meteor.Error("not authorized");
    }

    FormalApps.insert({
      logo: logo,
      link: link,
      createAt: new Date()
    })
  },

  /*
  removeTask(taskId){
    if (task.private && task.owner != Meteor.userId()) {
      throw new Meteor.Error("Not-authorized: Only the owner can remove private task");
    }
    Tasks.remove(taskId);
  },

  setChecked(taskId, setChecked){
    if (task.private && task.owner != Meteor.userId()) {
      throw new Meteor.Error("Not-authorized: Only the owner can check private task");
    }
    Tasks.update(taskId, {$set: {checked: setChecked}});
  },

  setPrivate(taskId, setToPrivate){
    const task = Tasks.findOne(taskId);

    //Make sure only the task owner can make a task private
    if (task.owner != Meteor.userId()) {
      throw new Meteor.Error("Not-authorized: Only the owner can set task private");
    }

    Tasks.update(taskId, {$set: {private: setToPrivate}});
  }*/
});