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
import QueueAnim from "rc-queue-anim";

const RecommendedAppBox = require("./RecommendedAppBox.jsx");

var RecommendAppsContainer = React.createClass({
  propTypes: {
    recommendedApps: React.PropTypes.array.isRequired,
  },

  getDefaultProps(){
    return {
      recommendedApps: [],
      //当前第一个recommendedApps的index
    }
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
      showRecommendApps: true,
      recommendNumbersToShow: 4,
    }
  },

  render (){
    const recommendedApps = this.state.showRecommendApps ? (
        _.compact(this.props.recommendedApps)
            .slice(0, this.state.recommendNumbersToShow)
            .map((app)=> {
              //console.log("app", app, "app.appName", app.appName);
              return <RecommendedAppBox
                  key={app.appName}
                  appName={app.appName}
                  appId={app._id}
                  noLogo={app.noLogo}
                  whenAppLogoClicked={()=>{console.log("app logo clicked")}}
                  whenAddBtnClicked={()=>{console.log("add btn clicked")}}
              />
            })
    ) : null;

    //console.log("recommendedApps", recommendedApps);
    return (

        <Row style={{marginBottom:80}}>
          <Card title="Octo推荐" bordered={false}
                bodyStyle={{padding:"0 24px"}}
                extra={<a onClick={this.handleGetNewRecommendation}>更多</a>}>
            {<QueueAnim key="recommendedApp"
                        type={['right', 'left']}
                        ease={['easeOutQuart', 'easeInOutQuart']}>
              {recommendedApps}
            </QueueAnim>}

          </Card>

        </Row>
    )

  },

  handleGetNewRecommendation(){
    if (this.state.recommendNumbersToShow>this.props.recommendedApps.length){
      alert("已显示所有推荐")
    }
    this.setState({recommendNumbersToShow:this.state.recommendNumbersToShow+4});
    //this.setState({showRecommendApps: !this.state.showRecommendApps})
  },
});

module.exports = RecommendAppsContainer;