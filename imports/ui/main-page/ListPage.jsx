/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * ListPage Component is the main page user can use to enter his/her apps, called by
 * "routes"
 *******************************************************************************/
import React from "react";
const FloatingEditButton = require('./FloatingEditButton.jsx');
const ChooseTopicPage = require('../welcome/ChooseTopicPage.jsx');
const ChooseAppPage = require('../welcome/ChooseAppPage.jsx');
const UserAppsContainer = require('./UserAppsContainer.jsx');
const RecommendAppsContainer = require('./RecommendAppsContainer.jsx');

var ListPage = React.createClass({
  mixins: [ReactMeteorData],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getMeteorData(){
    if (Meteor.user()) {
      // appId, appName,logoURL,loginLink,registerLink,userNames,defaultUserName,lastLoginTime
      const findUserApps = UserApps.find({userId: Meteor.userId()}).fetch()[0];
      const userCredentials = UserAppCredentials.findOne({userId: Meteor.userId()});

      return {
        currentUser: Meteor.user(),
        chosenPublicApps: findUserApps ? findUserApps.publicApps : [],
        chosenTopics: findUserApps ? findUserApps.topics : [],
        hexIv: findUserApps && findUserApps.hexIv ? findUserApps.hexIv : "",
        userCredentials: userCredentials,
      }
    } else {
      return {
        currentUser: null,
        chosenPublicApps: [],
        chosenTopics: [],
        hexIv: "",
      }
    }
  },

  getInitialState(){
    return {
      userEditStatus: "default",
      openChooseTopicPage: false,
      openChooseAppPage: false,
    }
  },

  componentWillMount(){
    //console.log("this.props.chosenTopics", this.data.chosenTopics);
    if (!this.data.chosenTopics || this.data.chosenTopics.length === 0) {
      this.setState({openChooseTopicPage: true});
    } else {
      //console.log("this.data.chosenTopics is ", this.data.chosenTopics);
    }
  },

  render(){
    //console.log("this.data.chosenTopics", this.data.chosenTopics);
    //console.log("this.data.userCredentials", this.data.userCredentials);

    return <div>
      {
        this.state.openChooseTopicPage ?
            <ChooseTopicPage onClosePage={this.handleCloseTopicPage}
                             openPage={this.state.openChooseTopicPage}/> : null
      }

      {/*this.state.openChooseAppPage ?
       <ChooseAppPage onClosePage={()=>{this.setState({openChooseAppPage: false})}}
       openPage = {this.state.openChooseAppPage} />: null*/
      }

      <FloatingEditButton
          whenEditButtonClicked={this.handleEditButtonClick}
          userEditStatus={this.state.userEditStatus}
      />


      {
        <UserAppsContainer
            currentUser={this.data.currentUser}
            chosenPublicApps={this.data.chosenPublicApps}
            chosenTopics={this.data.chosenTopics}
            hexIv={this.data.hexIv}
            userEditStatus={this.state.userEditStatus}
            userCredentials={this.data.userCredentials}
            appContainerZIndex={(this.state.userEditStatus === "remove" || this.state.userEditStatus === "config")? "400":"inherit"}
        />
      }
      <h2>Octo推荐</h2>
      <RecommendAppsContainer
          currentUser={this.data.currentUser}
          chosenPublicApps={this.data.chosenPublicApps}
          chosenTopics={this.data.chosenTopics}
          hexIv={this.data.hexIv}
          userEditStatus={this.state.userEditStatus}
          userCredentials={this.data.userCredentials}
          appContainerZIndex={(this.state.userEditStatus === "remove" || this.state.userEditStatus === "config")? "400":"inherit"}
      />
    </div>
  },

  handleCloseTopicPage(chooseApps){
    if (chooseApps) {// 开始选择常用的网站
      this.setState({openChooseTopicPage: false, openChooseAppPage: true});
    } else {
      this.setState({openChooseTopicPage: false});
    }
  },

  handleEditButtonClick(i){
    //console.log(i);
    if (typeof i === "object") {
      this.setState({userEditStatus: "default"});
    } else switch (i) {
      case 0:
        this.context.router.push("/catalog");
        break;
      case 1:
        this.setState({userEditStatus: "remove"});
        break;
      case 2:
        this.setState({userEditStatus: "config"});
        break;
      case 3:
        this.setState({userEditStatus: "register"});
        break;
      default:
        alert(i + " is clicked, don't know how to handle.");
    }
    //this.setState({focusedIndex:i});
  },


});

module.exports = ListPage;