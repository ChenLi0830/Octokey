/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * ListPage Component is the main page user can use to enter his/her apps, called by
 * "routes"
 *******************************************************************************/
const FloatingEditButton = require('./FloatingEditButton.jsx');
const ChooseTopicPage = require('../welcome/ChooseTopicPage.jsx');
const ChooseAppPage = require('../welcome/ChooseAppPage.jsx');
const UserAppsContainer = require('./UserAppsContainer.jsx');

var ListPage = React.createClass({
  mixins: [ReactMeteorData],

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getMeteorData(){
    if (Meteor.user()) {
      // appId, appName,logoURL,loginLink,registerLink,userNames,defaultUserName,lastLoginTime
      let findUserApps = UserApps.find({userId: Meteor.userId()}).fetch()[0];

      return {
        currentUser: Meteor.user(),
        chosenPublicApps: findUserApps ? findUserApps.publicApps : [],
        chosenTopics: findUserApps ? findUserApps.topics : [],
        hexIv: findUserApps && findUserApps.hexIv ? findUserApps.hexIv : "",
      }
    } else {
      return {
        currentUser: null,
        chosenPublicApps: [],
        chosenTopics:[],
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
    console.log("this.props.chosenTopics", this.data.chosenTopics);
    if (!this.data.chosenTopics || this.data.chosenTopics.length === 0) {
      this.setState({openChooseTopicPage: true});
    } else {
      console.log("this.data.chosenTopics is ", this.data.chosenTopics);
    }
  },

  render(){
    //console.log("this.data.chosenTopics", this.data.chosenTopics);

    return <div>
      {
        this.state.openChooseTopicPage ?
          <ChooseTopicPage onClosePage={this.handleCloseTopicPage}
                           openPage = {this.state.openChooseTopicPage}/>: null
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
            currentUser = {this.data.currentUser}
            chosenPublicApps = {this.data.chosenPublicApps}
            chosenTopics = {this.data.chosenTopics}
            hexIv = {this.data.hexIv}
            userEditStatus = {this.state.userEditStatus}
            appContainerZIndex = {(this.state.userEditStatus === "remove" || this.state.userEditStatus === "config")? "400":"inherit"}
        />
      }
    </div>
  },

  handleCloseTopicPage(chooseApps){
    if (chooseApps){// 开始选择常用的网站
      this.setState({openChooseTopicPage: false, openChooseAppPage:true});
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