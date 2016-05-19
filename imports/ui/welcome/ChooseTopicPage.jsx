/*******************************************************************************
 * Copyright (C) 2016 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2016-4-7
 *
 * Choose Topic Page component for users to choose their interested topics
 *******************************************************************************/ import React from "react"
const WhiteOverlay = require('./WhiteOverlay.jsx');
const TopicBox = require('./TopicBox.jsx');
const ChoosePageFooter = require('./ChoosePageFooter.jsx');

const TopicModalContainerAdd = require('./TopicModalContainerAdd.jsx');

import {Col, Row, Grid} from "react-bootstrap";
import _ from "lodash";
import {colors as Colors} from "material-ui/styles";
import { Button, Checkbox } from 'antd';

const styles = {
  titleDiv: {margin: "50px auto 20px auto", textAlign: "center"},
  titleMain: {color: Colors.grey800},
  titleSub: {color: Colors.grey600, fontWeight: "100"},
  extraInfoCol: {marginBottom: "120px", textAlign: "center"},
  extraInfoDiv: {margin: "40px auto"},
  extraInfoContent: {fontWeight: 200, display: "inline-block", marginLeft: "5px"},
};

const ChooseTopicPage = React.createClass({
  propTypes: {
    onClosePage: React.PropTypes.func.isRequired,
    openPage: React.PropTypes.bool.isRequired,
  },

  mixins: [ReactMeteorData],

  getMeteorData() {
    const subHandles = Meteor.userId() ?
        [Meteor.subscribe("topics"),] : [];

    const subsReady = _.every(subHandles, function (handle) {
      return handle.ready();
    });

    const currentUserId = Meteor.userId();
    return {
      subsReady: subsReady,
      currentUserId: currentUserId,
      topics: currentUserId ? Topics.find({}, {sort: {topicRank: 1}}).fetch() : null,
    };
  },

  getInitialState(){
    return {
      modalOpen: false,
      selectedTopics: [],
      chooseAppsCheck: true,
    }
  },

  render(){
    const topicBoxes = this.data.topics.map((topic)=> {
      const checked = _.findIndex(this.state.selectedTopics, (selectedTopic)=> {
            return selectedTopic.topicId === topic._id;
          }) > -1;

      //const iconURL = OctoClientAPI.getTopicIconUrl(topic._id);
      return <TopicBox key={topic._id}
                       topicId={topic._id}
                       iconURL={OctoClientAPI.getTopicIconUrl(topic._id)}
                       topicName={topic.topicName}
                       topicRank={topic.topicRank}
                       followCount={topic.followCount}
                       checked={checked}
                       whenTopicClicked={this.handleTopicClicked}/>;
    });

    const createTopicBtn = OctoClientAPI.isAdmin() ?
        <div>
          <TopicModalContainerAdd
              modalOpen={this.state.modalOpen}
              onModalClose={()=>{this.setState({modalOpen:false});}}
              //allCategories={this.props.allCategories}
          />
          <Button type="ghost"
                  onClick={()=>{this.setState({modalOpen:true})}}>
            {"添加Topic"/*message*/}
          </Button>
        </div>
        : null;

    return (<div>
      <WhiteOverlay entrance="fadeInUp"
                    exit="fadeOutLeft"
                    openOverlay={this.props.openPage}>
        <div>
          <Grid>

            <div style={styles.titleDiv}>
              <h1 style={styles.titleMain}>你想关注的兴趣</h1>
              <h2 style={styles.titleSub}>我们将根据你关注的兴趣定制你的应用推荐</h2>
            </div>

            <Row>
              <Col xs={8} xsOffset={2}>
                {topicBoxes}
              </Col>
              <Col xs={2}>
              </Col>
            </Row>

            <Row>
              <Col xs={12} style={styles.extraInfoCol}>
                {createTopicBtn}
                <div style={styles.extraInfoDiv}>
                  <label>
                    <Checkbox checked={this.state.chooseAppsCheck}
                              onChange={()=>{this.setState({chooseAppsCheck:!this.state.chooseAppsCheck})}}/>
                    <h3 style={styles.extraInfoContent}>
                      开启智能兴趣分析，自动筛选好评网站
                    </h3>
                  </label>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </WhiteOverlay>
      <ChoosePageFooter
          okText={"选好了" /*message*/}
          onOkClicked={this.handleOKBtnClicked}
          onSkipClicked={this.handleSkipBtnClicked}
      />
    </div>)
  },

  // 用户添加or取消topic
  handleTopicClicked(topicId, topicName, topicRank){
    const clickedTopic = {topicId: topicId, topicName: topicName, topicRank: topicRank};
    let selectedTopics = this.state.selectedTopics;

    const topicIndex = _.findIndex(selectedTopics, (selectedTopic)=> {
      return selectedTopic.topicId === clickedTopic.topicId
    });

    if (topicIndex === -1) {// Select topic
      selectedTopics.push(clickedTopic);
    } else {// Unselect topic
      selectedTopics.splice(topicIndex, 1);
    }

    this.setState({selectedTopics: selectedTopics});
  },

  handleOKBtnClicked(){
    Meteor.call("followTopics", this.state.selectedTopics, (error)=> {
      if (error) {
        console.log("error", error);
      }
      console.log("User successfully followed the topics");
      this.props.onClosePage(this.state.chooseAppsCheck);
    });
  },

  handleSkipBtnClicked(){
    Meteor.call("followTopics", [], (error)=> {
      if (error) {
        console.log("error", error);
      }
      console.log("User successfully skipped the topics");
      this.props.onClosePage(this.state.chooseAppsCheck);
    });
  },
});

module.exports = ChooseTopicPage;

