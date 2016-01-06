//Todo: remove as much as possible
Meteor.users.allow({
  insert: function(userId){
    return !!userId;
  },
  update: function(userId){
    return !!userId;
  },
  remove: function(userId){
    return !!userId;
  }
});
