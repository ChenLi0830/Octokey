/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/
import React from "react";
import Collapse from 'antd/lib/collapse';
import Button from "antd/lib/button";
import InputNumber from 'antd/lib/input-number';
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import Icon from "antd/lib/icon";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import message from "antd/lib/message";
import Table from "antd/lib/table";
import Modal from "antd/lib/modal";
const confirm = Modal.confirm;

import classNames from 'classnames';
const Option = Select.Option;


const Panel = Collapse.Panel;


import {FormattedMessage} from "react-intl";

const styles = {};

const TopicTopApps = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  propTypes: {
    allTopics: React.PropTypes.array.isRequired,
    allPublicApps: React.PropTypes.array.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getInitialState(){
    return {
      activeTopicName: "",
      toBeAddedAppRank: 1,
      addAppToTopic:"",
      searchText: "",
      searchFocus: false,
    }
  },


  render() {
    //console.log("this.props.allTopics", this.props.allTopics);
    //console.log("this.props.allPublicApps", this.props.allPublicApps);

    /* for collapse panels */
    const tableColumns = [{
      title: '应用名',
      dataIndex: 'appName',
      key: 'appName',
      render: (text) => <a href="#" onClick={this.showConfirmRemove.bind(null, text)}>{text}</a>,
    }, {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
    }];

    let topicPanels = this.props.allTopics.map((topic)=> {
      //console.log("topic", topic);
      const topAppsData = topic.topAppsOverall.map((app)=> {
        return {
          key: app.appId,
          appName: app.appName,
          rank: app.rank,
        }
      });

      return <Panel header={topic.topicName} key={topic.topicName}>
        <Table columns={tableColumns} dataSource={topAppsData} size="small"/>
      </Panel>
    });


    /* for adding app to topic */
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.searchText.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.searchFocus,
    });

    const filteredApps = _.filter(this.props.allPublicApps, (app)=> {
      const searchText = this.state.searchText.trim().toLowerCase();
      return app.appName.toLowerCase().startsWith(searchText);
    });

    const appOptions = filteredApps.map(
        app => <Option key={app.appName+"$"+app._id}>{app.appName}</Option>);

    const topicOptions = this.props.allTopics.map(
        topic => <Option key={topic.topicName+"$"+topic._id}>{topic.topicName}</Option>);

    return (
        <div>
          <Row>
            <Collapse
                accordion
                activeKey={this.state.activeTopicName}
                onChange={(key)=>{this.setState({activeTopicName:key})}}>
              {topicPanels}
            </Collapse>
          </Row>

          <Row type="flex" justify="space-around" style={{marginTop:"20px"}}>
            <Col xs={6}>
              <Select placeholder="选择Topic"
                      value={this.state.addAppToTopic} style={{ width: 120 }}
                      onChange={(topic)=>{this.setState({addAppToTopic:topic})}}>
                {topicOptions}
              </Select>
            </Col>

            <Col xs={6}>
              <div className="ant-search-input-wrapper" style={this.props.style}>
                <Input.Group className={searchCls}>
                  <Select
                      combobox
                      value={this.state.searchText}
                      placeholder="选择应用"
                      notFoundContent=""
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={(searchText)=>{this.setState({searchText})}}
                      onFocus={this.handleFocusBlur}
                      onBlur={this.handleFocusBlur}>
                    {appOptions}
                  </Select>
                  <div className="ant-input-group-wrap">
                    <Button className={btnCls} onClick={this.handleSubmit}>
                      <Icon type="search"/>
                    </Button>
                  </div>
                </Input.Group>
              </div>
            </Col>

            <Col xs={6}>
              <p style={{display:"inline-block"}}>排序序号：</p>
              <InputNumber min={1} max={50} value={this.state.toBeAddedAppRank}
                           onChange={(rankValue)=>{this.setState({toBeAddedAppRank: rankValue})}}/>
            </Col>

            <Col xs={3}>
              <Button onClick={this.handleAddTopApp}>添加</Button>
            </Col>
          </Row>
        </div>
    )
  },

  //把应用添加到topic的top list
  handleAddTopApp(){
    const topicName = this.state.addAppToTopic.split("$")[0];
    const topicId = this.state.addAppToTopic.split("$")[1];
    const appName = this.state.searchText.split("$")[0];
    const appId = this.state.searchText.split("$")[1];
    //console.log("this.state.toBeAddedAppRank", this.state.toBeAddedAppRank);
    //console.log("topicName, topicId, appName, appId", topicName, topicId, appName, appId);

    let hide = message.loading('正在执行中...', 0);
    Meteor.call("addAppToTopic", appId, appName, this.state.toBeAddedAppRank, topicId, "overall", (error)=>{
      hide();
      if (error){
        console.log("error", error);
        message.error('添加应用出错');
      } else {
        message.success('添加成功');
      }
    });
  },

  //确认是否要把应用从topic的top list删除
  showConfirmRemove(appName, e){
    confirm({
      title: '您是否确认要删除这个应用?',
      content: '删除后, 这个应用会从这个Topic的top list下消失, 但应用本身不会被删除',
      onOk: ()=>{this.handleRemoveTopApp(appName, e)},
    });
  },

  //把应用从topic的top list删除
  handleRemoveTopApp(appName, e){
    const activeTopic = _.find(this.props.allTopics, (topic)=>{return topic.topicName===this.state.activeTopicName});
    const toBeRemovedApp = _.find(activeTopic.topAppsOverall, (app)=>{return app.appName===appName});
    //console.log("app",toBeRemovedApp,"is getting deleted from topic", activeTopic);

    let hide = message.loading('正在执行中...', 0);
    Meteor.call("removeAppInTopic", toBeRemovedApp.appId, activeTopic._id, "overall", (error)=>{
      hide();
      if (error){
        console.log("error", error);
        message.error('删除应用出错');
      } else {
        message.success('删除成功');
      }
    });
  },
});

module.exports = TopicTopApps;