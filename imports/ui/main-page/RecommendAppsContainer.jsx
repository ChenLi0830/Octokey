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
//import QueueAnim from "antd/lib/queue-anim"
import QueueAnim from "rc-queue-anim";

const RecommendedAppBox = require("./RecommendedAppBox.jsx");

var RecommendAppsContainer = React.createClass({
  propTypes: {
    recommendedApps: React.PropTypes.array.isRequired,
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
    return {
      showRecommendApps: true,
      show:true,
      items: [{
        children: '依次进入1',
        key: 1,
      }, {
        children: '依次进入2',
        key: 2,
      }, {
        children: '依次进入3',
        key: 3,
      }, {
        children: '依次进入4',
        key: 4,
      }, {
        children: '依次进入5',
        key: 5,
      }, {
        children: '依次进入6',
        key: 6,
      }],
    }
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
    const recommendedApps = this.state.showRecommendApps ? (
        _.compact(this.props.recommendedApps).slice(0, numbersToShow).map((app)=> {
          console.log("app", app, "app.appName", app.appName);
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

    console.log("recommendedApps", recommendedApps);
    return (

        <Row style={{marginBottom:80}}>
          <Card title="Octo推荐" bordered={false}
                bodyStyle={{padding:"0 24px"}}
                extra={<a href="#" onClick={this.handleGetNewRecommendation}>更多</a>}>
            {/*<QueueAnim key="recommendedApp"
             delay={500}
             type={['right', 'left']}
             ease={['easeOutQuart', 'easeInOutQuart']}>
             {/!*recommendedApps*!/recommendedApps2}
             </QueueAnim>*/}

            <QueueAnim leaveReverse>
              {this.state.show ? this.state.items.map((item) => <div key={item.key}>
                {item.children}
              </div>) : null}
            </QueueAnim>
          </Card>
        </Row>
    )

  },

  handleGetNewRecommendation(){
    this.setState({showRecommendApps: !this.state.showRecommendApps, show: !this.state.show})
  },
});

module.exports = RecommendAppsContainer;