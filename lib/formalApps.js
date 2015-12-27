// Define a collection to hold our tasks
FormalApps = new Mongo.Collection("formalApps");

//TODO add methods for formalApps
//add new app
//update app (logo, link)
//get app(app._id)
Meteor.methods({
/*  addTask(text){
    if (!Meteor.userId()) {
      throw new Meteor.Error("not authorized");
    }

    Tasks.insert({
      text: text,
      createAt: new Date(),
      username: Meteor.user().username,
      owner: Meteor.userId()
    })
  },

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