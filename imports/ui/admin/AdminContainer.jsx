/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2016-5-26
 *
 * Container of admin component
 *******************************************************************************/
import React from "react";
import _ from "lodash";

const Admin  = require("./Admin.jsx");

var AdminContainer = React.createClass({
  mixins: [
    ReactMeteorData,
  ],

  getMeteorData(){
    OctoClientAPI.fetchDataToSessionIfNull("allPublicApps", "getAllPublicApps");

    const subsHandles = [
      Session.get("allPublicApps"),
      Meteor.subscribe("topics"),
      Meteor.subscribe("allCategories"),
    ];
    const subsReady = OctoClientAPI.subsHandlesAreReady(subsHandles);

    const allCategories = ZenCategories.find({}, {sort: {index: 1}}).fetch();

    return {
      allCategories: allCategories,
      allTopics: Topics.find().fetch(),
      subsReady: subsReady,
    }
  },

  render(){
    return <div>
      <Admin
          subsReady={this.data.subsReady}
          allTopics={this.data.subsReady ? this.data.allTopics : []}
          allPublicApps={this.data.subsReady ? Session.get("allPublicApps") : []}
          allCategories={this.data.subsReady ? this.data.allCategories : []}
          {...this.props}
      />
    </div>
  },

});

module.exports = AdminContainer;