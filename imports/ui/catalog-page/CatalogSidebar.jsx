/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Side Bar component - called by "Catalog"
 *******************************************************************************/ import React from "react"
var CreatePublicAppButton = require('./CreatePublicAppButton.jsx');
var CreateCategoryButton = require('./CreateCategoryButton.jsx');
var SearchBox = require('./SearchBox.jsx');
var CreatePrivateAppButton = require('./CreatePrivateAppButton.jsx');
var CategoryList = require('./CategoryList.jsx');
import {List,ListItem} from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";
import Paper from "material-ui/Paper";

var CatalogSideBar = React.createClass({
  propTypes: {
    allCategories: React.PropTypes.array.isRequired,
    zenApps: React.PropTypes.array.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      currentUser: Meteor.user()
    }
  },

  render(){
    let createPublicAppButton = Roles.userIsInRole(this.data.currentUser, 'admin') ?
        <CreatePublicAppButton allCategories={this.props.allCategories}/> : null;
    let createCategoryButton = Roles.userIsInRole(this.data.currentUser, 'admin') ?
        <CreateCategoryButton allCategories={this.props.allCategories}/> : null;

    //Todo Add search box
    return <div>

        {createPublicAppButton}
        {/*<CreatePrivateAppButton/>*/}

        <CategoryList allCategories={this.props.allCategories}/>
        {createCategoryButton}
    </div>
  },
});

module.exports = CatalogSideBar;