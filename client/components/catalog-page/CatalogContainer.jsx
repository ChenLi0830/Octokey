/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-3-25
 *
 * Container of Catalog component - separate data from UI and logic, called by "routes"
 *******************************************************************************/
var Catalog = require('./Catalog.jsx');

var CatalogContainer = React.createClass({
  mixins: [
    ReactMeteorData,
  ],

  getMeteorData(){
    OctoAPI.fetchDataToSessionIfNull("allPublicApps", "getAllPublicApps");

    const subsHandles = [
      Session.get("allPublicApps"),
      Meteor.subscribe("allCategories"),
      Meteor.subscribe("userApps"),
    ];
    const subsReady = OctoAPI.subsHandlesAreReady(subsHandles);

    const AppOfUser = UserApps.findOne({userId: Meteor.userId()}, {reactive: true});
    const allCategories = ZenCategories.find({}, {sort: {index: 1}}).fetch();

    let subscribeList = [];
    if (subsReady) {
      Session.get("allPublicApps").map(function (publicApp) {
        let subscribed = _.findIndex(AppOfUser.publicApps, function (subscribedApp) {
              return subscribedApp.appId === publicApp._id
            }) > -1;
        subscribeList[publicApp._id] = subscribed;
      })
    }

    return {
      subscribeList: subscribeList,
      allCategories: allCategories,
      subsReady: subsReady
    }
  },

  render(){
    return <div>
      <Catalog
          subsReady={this.data.subsReady}
          subscribeList={this.data.subscribeList}
          allPublicApps={Session.get("allPublicApps") || []}
          allCategories={this.data.allCategories}
      />
    </div>
  },

});

module.exports = CatalogContainer;