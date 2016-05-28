/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-4-16
 *
 * Component for a the container of recommended apps in the list page, called by "ListPage"
 *******************************************************************************/

import React from "react";
import _ from "lodash";

import Row from "antd/lib/row";
import Card from 'antd/lib/card';

const RecommendedAppBox = require("./RecommendedAppBox.jsx");

var RecommendAppsContainer = React.createClass({
  propTypes: {
    recommendedApps: React.PropTypes.array.isRequired,
    //chosenTopics: React.PropTypes.array.isRequired,
    //chosenPublicApps: React.PropTypes.array.isRequired,
    //currentUser: React.PropTypes.object.isRequired,
    //hexIv: React.PropTypes.string.isRequired,
    //userEditStatus: React.PropTypes.string.isRequired,
    //userCredentials: React.PropTypes.object.isRequired,
    //appContainerZIndex: React.PropTypes.string.isRequired,
  },

  getDefaultProps(){
    return {
      recommendedApps: []
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {}
  },

  componentWillMount(){
    // Listen to the registration progress
    window.addEventListener("message", this.handleUpdateProgress);
  },

  componentWillUnmount(){
    window.removeEventListener("message", this.handleUpdateProgress);
  },

  render (){
    console.log("recommendedApps", this.props.recommendedApps);
    const numbersToShow = 4;
    const recommendedApps = _.compact(this.props.recommendedApps).slice(0,numbersToShow).map((app)=> {
      console.log("app", app, "app.appName", app.appName);
      return <RecommendedAppBox
          key={app.appName}
          appName={app.appName}
          appId={app._id}
          noLogo={app.noLogo}
          whenAppLogoClicked={()=>{console.log("app logo clicked")}}
          whenAddBtnClicked={()=>{console.log("add btn clicked")}}
      />
    });

    return (
        <Row style={{marginBottom:80}}>
          <Card title="Octo推荐" bordered={false}
                bodyStyle={{padding:"0 24px"}} extra={<a href="#">更多</a>}>
            {recommendedApps}
          </Card>
        </Row>
    )
  },
});

module.exports = RecommendAppsContainer;