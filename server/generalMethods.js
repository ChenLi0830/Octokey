Meteor.methods({
  inDevMode(){
    return process.env.NODE_ENV === "development";
  }
});