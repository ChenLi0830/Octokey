/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-3-25
 *
 * Container of Catalog component - separate data from UI and logic, called by "routes"
 *******************************************************************************/
import React from "react";
import _ from "lodash";
var Catalog = require('./Catalog.jsx');

var CatalogContainer = React.createClass({
  mixins: [
    ReactMeteorData,
  ],

  getMeteorData(){
    //OctoClientAPI.fetchDataToSessionIfNull("allPublicApps", "getAllPublicApps");

    const subsHandles = [
      "allPublicApps",
      "allCategories",
      "userApps",
    ];
    const subsReady = OctoClientAPI.subsHandlesAreReady(subsHandles);

    const AppOfUser = UserApps.findOne({userId: Meteor.userId()}, {reactive: true});
    const allCategories = ZenCategories.find({}, {sort: {index: 1}}).fetch();
    const allPublicApps = ZenApps.find({}, {sort: {subscribeCount: -1}}).fetch();

    let subscribeList = [];
    if (subsReady) {
      allPublicApps.map(function (publicApp) {
        let subscribed = _.findIndex(AppOfUser.publicApps, function (subscribedApp) {
              return subscribedApp.appId === publicApp._id
            }) > -1;
        subscribeList[publicApp._id] = subscribed;
      })
    }

    return {
      subscribeList: subscribeList,
      allCategories: allCategories,
      allPublicApps: allPublicApps,
      subsReady: subsReady
    }
  },

  render(){
    return <div>
      <Catalog
          subsReady={this.data.subsReady}
          subscribeList={this.data.subsReady ? this.data.subscribeList : []}
          allPublicApps={this.data.subsReady ? this.data.allPublicApps : []}
          allCategories={this.data.subsReady ? this.data.allCategories : []}
      />
    </div>
  },

});

module.exports = CatalogContainer;