/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Component for a single App box, called by "UserAppsContainer"
 *******************************************************************************/
import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import Col from "antd/lib/col";
import Modal from "antd/lib/modal";

import Paper from "material-ui/Paper";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

import {
    ContentClear,
    ContentRemove,
    ActionSettings,
    AvFiberNew,
    } from "material-ui/svg-icons"

const styles = {
};

var RecommendedAppBox = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    added: React.PropTypes.bool.isRequired,
    whenAppLogoClicked: React.PropTypes.func.isRequired,
    whenAppAdded: React.PropTypes.func.isRequired,
  },

  getInitialState(){
    return {
    }
  },

  render() {

    var tileStyle = this.getTileStyle(this.props.userEditStatus);

    var image = this.getTileImage(this.props.userEditStatus);
    var usernameItems = this.props.usernames.map((username)=> {
      return <MenuItem key={username} primaryText={username} value={username}/>
    });

    //console.log("usernames", this.props.usernames);
    return <div>
      <Col lg={4} md={4} sm={6} xs={8} style={{padding:"0"}}>
        {
          this.props.usernames.length <= 1 ? null : (
              <Modal title={this.props.appName + "-账户选择"}
                     okText="完成"
                     cancelText="取消"
                     visible={this.state.modalChooseAccountOpen}
                     onOk={()=>{this.setState({modalChooseAccountOpen:false})}}
                     onCancel={()=>{this.setState({modalChooseAccountOpen:false})}}
              >
                <Menu zDepth={0} ref="menu"
                      onChange={this.handleAccountTouchTap}
                      width="100%"
                      autoWidth={false}
                      listStyle={{display:"block"}}
                >
                  {usernameItems}
                </Menu>
              </Modal>
          )
        }

        <Paper rounded={false}
               ref="appBox"
               style={tileStyle}
               onMouseEnter={this.handleMouseEnter}
               onMouseLeave={this.handleMouseLeave}
               zDepth={this.state.hovered?1:0}
               onTouchTap={this.handleTouchTap}>
          {image}
          {
            this.state.hovered ?
                <div className="animated fadeIn"
                     style={_.extend({}, styles.boxBottomBanner, {width: this.props.width})}>
                  {this.props.appName}
                </div>
                : null
          }
        </Paper>
      </Col>
    </div>
  },

  handleMouseEnter(){
    this.setState({
      hovered: true
    })
  },

  handleMouseLeave(){
    this.setState({
      hovered: false
    })
  },

  handleTouchTap(event){
    //If trying to login
    if (this.props.userEditStatus === "default") {
      if (this.props.usernames.length === 0) {
        this.props.whenAppTileClicked(this.props.appId)
      }
      else if (this.props.usernames.length === 1) {
        this.props.whenAppTileClicked(this.props.appId, this.props.usernames[0])
      }
      else {//More than 1 username, openPopOver to for user to choose
        this.setState({
          modalChooseAccountOpen: true,
          anchorEl: event.currentTarget,
        });
      }
    } else {//If trying to remove, edit or register
      this.props.whenAppTileClicked(this.props.appId)
    }

  },

  handleAccountTouchTap(event, selectedIndex, menuItem) {
    //console.log("selectedIndex",selectedIndex);
    this.props.whenAppTileClicked(this.props.appId, selectedIndex);
    this.setState({modalChooseAccountOpen: false});
  },

  getTileStyle(userEditStatus){
    let baseStyle = {
      margin: 0,
      borderRadius: "5px",
      width: this.props.width,
      height: this.state.height,
      cursor: "pointer"
    };

    switch (userEditStatus) {
      case "default" :
      case "register" :
        baseStyle.backgroundColor =
            this.state.hovered ? ZenColor.grey1 : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
      case "remove" :
        baseStyle.backgroundColor =
            this.state.hovered ? ZenColor.orange : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
      case "config" :
        baseStyle.backgroundColor = this.state.hovered ? ZenColor.cyan : "rgba(255, 255, 255, 0.0)";
        return baseStyle;
        break;
    }
  },

  getTileImage(userEditStatus){
    //if (this.props.logoURL===""){
    //
    //}
    let image = this.props.logoURL === "" ?
        <div style={styles.noLogoBox}>
          <div style={styles.noLogoText}>{this.props.appName[0]}</div>
        </div>
        : <img src={this.props.logoURL}
               style={{width:"100px", borderRadius:"5px"}}
               className="vertical-center horizontal-center"/>;

    switch (userEditStatus) {
      case "default":
        return image;
        break;
      case "register":
        return this.state.hovered ?
            <AvFiberNew className="vertical-center horizontal-center"
                        style={{height:"60px", width:"60px", fill:ZenColor.cyan}}/> : image;
        break;
      case "remove":
        return this.state.hovered ?
            <ContentRemove className="vertical-center horizontal-center"
                           style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
        break;
      case "config":
        return this.state.hovered ?
            <ActionSettings className="vertical-center horizontal-center"
                            style={{height:"60px", width:"60px", fill:ZenColor.white}}/> : image;
        break;
    }
  }
});

module.exports = RecommendedAppBox;