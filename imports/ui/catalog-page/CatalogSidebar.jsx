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
    let createPublicAppButton = OctoClientAPI.isAdmin(this.data.currentUser) ?
        <CreatePublicAppButton allCategories={this.props.allCategories}/> : null;
    let createCategoryButton = OctoClientAPI.isAdmin(this.data.currentUser) ?
        <CreateCategoryButton allCategories={this.props.allCategories}/> : null;

    //Todo Add search box
    return <div>
      <Paper zDepth={1}
             style={{
             backgroundColor:ZenColor.white,

             padding:0,
             borderRadius:"5px"}}>
        {/*<SearchBox zenApps = {this.props.zenApps}
         subscribeList={this.props.subscribeList}
         allCategories={this.props.allCategories}
         />*/}
        {/*<Divider />*/}
        {createPublicAppButton}
        {/*<CreatePrivateAppButton/>*/}
        <Divider />
        <CategoryList allCategories={this.props.allCategories}/>
        {createCategoryButton}
      </Paper>
    </div>
  },
});

module.exports = CatalogSideBar;