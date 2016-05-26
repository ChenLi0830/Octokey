T9n.setLanguage("zh_cn");

if (Meteor.isProduction){
  console = console || {};
  console.log = function(){};
}

if (Meteor.isDevelopment){
  console.log("Under developer mode")
}
