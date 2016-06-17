//T9n.setLanguage("zh-CN");
//console.log("error didn't happen in startUp");

if (Meteor.isProduction){
  console = console || {};
  console.log = function(){};
}

if (Meteor.isDevelopment){
  console.log("Under developer mode")
}
