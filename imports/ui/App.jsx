/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * App component is the root element to load the app. Called by "router".
 *******************************************************************************/
import React from "react"
import {Paper} from "material-ui";
import {Row,Col} from "antd";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from "lodash";
import {customizeMUITheme, ZenRawTheme} from "../../client/globals/theme";
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var Actions =  require("./action-and-stores/Actions.jsx");
var AppLoading = require('./AppLoading.jsx');
var Header = require('./header/Header.jsx');
var UnloginHeader = require('./header/UnloginHeader.jsx');
const Footer = require('./header/Footer.jsx');
import {EncryptionStore} from "./action-and-stores/EncryptionStore.jsx";

const styles = {
  wrapper: {
    //padding: "0 0 0 0",
    //padding: "64px 0 0 0",
    minHeight: "100%",
    position: "relative",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ECEFF1",
/*    background: "linear-gradient(270deg, #4bcf93, #4b79cf, #a24bcf)",
    backgroundSize: "600% 600%",
    animation: "AnimationName 5s ease infinite",*/
  },

  heightPercent100: {
    height: "100%",
  }
};

var App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    if (!Meteor.userId()) {//If user is not logged in
      return {
        subsReady: true,
        currentUserId: Meteor.userId(),
        UserApps: null,
      };
    }

    //console.log("Session.get(ajaxReadyCount)", Session.get("ajaxReadyCount"));
    const
        subHandles = [Meteor.subscribe("userApps"), Meteor.subscribe("userCredentials")],
        currentUserId = Meteor.userId(),
        userApps = UserApps.findOne({userId: currentUserId}),

        subsReady = _.every(subHandles, function (handle) {
          return handle.ready();
        });

    //Todo add this part in welcome page for topic images
    /*    if (subsReady) {
     if (Session.get("ajaxReadyCount") === 0) {//Ajax call should only be triggered once
     userApps.publicApps.map((publicApp)=> {
     fetch(publicApp.logoURL).then((response)=> {
     if (response.status === 200) {//inc if successfully loaded the image
     var prevValue = Session.get("ajaxReadyCount");
     //Todo 标记没有logo的app,将来用
     //if (response.headers.getAll("Content-Type") === "image/noFile")
     Session.set("ajaxReadyCount", prevValue + 1);
     return response.text();
     }
     })
     });
     }
     }*/

    return {
      subsReady: subsReady /*&& Session.get("ajaxReadyCount") >= userApps.publicApps.length*/,//Todo
                                                                                              // remove
                                                                                              // -1
      currentUserId: currentUserId,
      userApps: userApps,
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },

  componentWillMount(){
    // Listen to the Extension's request for user's login info and hexIv
    window.addEventListener("message", this.checkAndSendData);

    //Ajax handle for images
    /*Session.set("ajaxReadyCount", 0);*/
  },

  componentWillUnmount(){
    window.removeEventListener("message", this.checkAndSendData);
  },

  getChildContext() {
    let muiTheme = getMuiTheme(ZenRawTheme/*, zIndex*/);
    let zenMUITheme = customizeMUITheme(muiTheme);
    return {
      muiTheme: zenMUITheme
    };
  },

  render(){
    //console.log("this.data.userApps", this.data.userApps);
    //console.log("Session.get(hexKey)", Session.get("hexKey"));
    console.log("EncryptionStore.getPassword", EncryptionStore.getPassword());
    console.log("Actions.getPassword", Actions.getPassword());

    if (this.data.userApps) {
      if (!Session.get("hexKey")) {//when user logged in with fresh session
        // Set Session variable "hexKey"
        console.log("start initKey");
        Actions.initKeySaltIv(this.data.userApps.hexSalt, this.data.userApps.hexIv);
      }
    }

    //flag of 是否show header
    const showFullHeader = this.checkIfShowFullHeader();

    //console.log("showFullHeader", showFullHeader);
    //Todo check userlogin status and check if the children is a restricted link, if it is,
    // redirect to login

    let containerStyle = this.getContainerStyle();
    //console.log("containerStyle", containerStyle);

    return (
        <div style={containerStyle}>
          {
            showFullHeader ?
                <Header location={this.props.location}/> : <UnloginHeader location={this.props.location}/>
          }

          {//不showheader的page也不添加grid
            showFullHeader ?
                <div>
                  <Row style={{marginTop:"60px"}}>
                    <Col xs={{ span: 18, offset: 3 }}>
                      {this.data.subsReady ?
                          this.props.children :
                          <AppLoading />
                      }
                    </Col>
                  </Row>
                </div> :
                (
                    this.data.subsReady ?
                          this.props.children :
                          <AppLoading />
                )
          }

          {/*<LanguageSelection/>*/}
          <Footer/>
        </div>
    )
  },

  checkAndSendData(event){//Wait for meteor data to be ready
    if (event.data.type === "extensionRequestInfo") {
      if (this.data.subsReady) {
        this.handleSendInfoToExtension(event);
      } else {
        //console.log("meteor data not ready");
        setTimeout(this.checkAndSendData.bind(this, event), 100);
      }
    }
  },

  handleSendInfoToExtension(event){
    var origin = event.origin || event.originalEvent.origin;
    if (origin !== document.location.origin) {//make sure message comes from Octokey
      return;
    }

    if (!this.data.currentUserId) {//make sure the user is logged in
      return;
    }

    const targetUrl = document.location.origin;
    if (event.data.type === "extensionRequestInfo") {
      //console.log("send meteor data");
      window.postMessage(//Communicate with plugin, post the message to the 'targetUrl'
          {
            event: "sendInfoToExtension",
            loginToken: localStorage["Meteor.loginToken"],
            loginTokenExpires: localStorage["Meteor.loginTokenExpires"],
            userId: localStorage["Meteor.userId"],
            hexIv: this.data.userApps.hexIv,
            hexKey: Session.get("hexKey"),
          },
          targetUrl
      );
    }
  },

  //登录和注册页面不显示header,其他都要
  checkIfShowFullHeader(){
    const routerPath = this.props.children.props.location.pathname;
    //console.log("routerPath", routerPath);
    const noHeaderPaths = ["/login", "/join", "/"];
    return _.every(noHeaderPaths, (noHeaderPath)=> {
      return routerPath !== noHeaderPath;
      //return routerPath.indexOf(noHeaderPath) === -1;
    });
  },

  getContainerStyle(){
    const showHeader = this.checkIfShowFullHeader();
    //如果是登录页面,就把height固定成100%, 否则就直接用styles.wrapper
    if (!showHeader) {
      return _.extend({}, styles.wrapper, styles.heightPercent100);
    } else {
      return styles.wrapper;
    }
  },
});

module.exports = App;