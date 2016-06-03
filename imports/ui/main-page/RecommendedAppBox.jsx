/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2016-5-28
 *
 * Component for a single Recommended app box, called by "RecommendAppsContainer"
 *******************************************************************************/
import React from "react";
import ReactDOM from "react-dom";

import Col from "antd/lib/col";
import Modal from "antd/lib/modal";
import Button from "antd/lib/button";

const styles = {
  noLogoBox: {
    position: "relative",
    height: "100px",
    width: "100px",
    backgroundColor: "#3399FF",
    borderRadius: "5px",
    marginLeft: "auto",
    marginRight: "auto",
    top: "50%",
    transform: "translateY(-50%)",
  },
  noLogoText: {
    textAlign: "center",
    top: "50%",
    transform: "translateY(-50%)",
    position: "relative",
    color: "white",
    fontSize: "48px",
    fontWeight: "800",
  },
};

var RecommendedAppBox = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    noLogo: React.PropTypes.bool.isRequired,
    whenAppLogoClicked: React.PropTypes.func.isRequired,
    whenAddBtnClicked: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      iconLoading: false
    }
  },

  render() {
    messages = this.context.intl.messages.RecommendAppsConainer;
    console.log("this.props.logoURL", this.props.logoURL);
    let image = this.props.noLogo ?
        <div style={styles.noLogoBox}>
          <div style={styles.noLogoText}>{this.props.appName[0]}</div>
        </div>
        : <img src={OctoClientAPI.getLogoUrl(this.props.appId)}
               style={{width:"100px", borderRadius:"5px"}}
               className="vertical-center horizontal-center"/>;

    return <div>
      <Col xs={6} style={{height:150}}>
        <Col xs={12} style={{height:"100%"}}>
          {image}
        </Col>

        <Col xs={12} style={{position: "relative", top: "50%", transform: "translateY(-50%)"}}>
          <p style={{lineHeight: "30px"}}>{this.props.appName}</p>
          <Button type="primary" loading={this.state.iconLoading}
                  onClick={this.handleSubscribeApp}>
            {messages["添加"]}
          </Button>
        </Col>
      </Col>
    </div>
  },

  handleSubscribeApp(){
    this.setState({iconLoading: true});
    Meteor.call("subscribePublicApp", this.props.appId, ()=> {
      this.setState({iconLoading: false});
    });
    //Todo remove app from recommendation list
  },
});

module.exports = RecommendedAppBox;