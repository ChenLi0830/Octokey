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
  boxBottomBanner: {
    position: "absolute",
    height: 35,
    bottom: 0,
    backgroundColor: "#fafafa",
    textAlign: "center",
    lineHeight: "35px",
    fontSize: "14px",
    color: "#888",
    borderRadius: "0px 0px 5px 5px",
    WebkitAnimationDuration: "0.3s",
  },
  boxBase: {
    position: "absolute",
    height: "100px",
    width: "100px",
    borderRadius: "5px",
    //marginLeft: "auto",
    //marginRight: "auto",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    msTransform: "translateX(-50%) translateY(-50%)",
    WebkitTransform: "translateX(-50%) translateY(-50%)",
  },
  noLogoBox: {
    backgroundColor: "#3399FF",
  },
  noLogoText: {
    textAlign: "center",
    top: "50%",
    transform: "translateY(-50%)",
    msTransform: "translateY(-50%)",
    WebkitTransform: "translateY(-50%)",
    position: "relative",
    color: "white",
    fontSize: "48px",
    fontWeight: "800",
  },
  logoImage: {
    width: "100px",
    borderRadius: "5px",
    transitionDuration: "0.5s"
  },
  boxHoverSVG: {
    position:"absolute",
    top:"50%",
    left:"50%",
    transform: "translateX(-50%) translateY(-50%)",
    msTransform: "translateX(-50%) translateY(-50%)",
    WebkitTransform: "translateX(-50%) translateY(-50%)",
    height:"60px",
    width:"60px",
  }
};

var AppBox = React.createClass({
  propTypes: {
    appId: React.PropTypes.string.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    usernames: React.PropTypes.array.isRequired,
    appName: React.PropTypes.string.isRequired,
    width: React.PropTypes.string.isRequired,
    whenAppTileClicked: React.PropTypes.func.isRequired,
    userEditStatus: React.PropTypes.string.isRequired,
  },

  getInitialState(){
    return {
      hovered: false,
      loaded: false,
      boxHeight: "0px",
      modalChooseAccountOpen: false,
    }
  },

  componentDidMount(){
    var boxSize = ReactDOM.findDOMNode(this.refs.appBox).offsetWidth;
    /*if (boxSize===180){
     console.log("boxSize", boxSize, "appName", this.props.appName);
     console.log(ReactDOM.findDOMNode(this.refs.appBox));
     }*/

    this.setState({//这里会trigger DOM re-render
      height: boxSize
    });
    //console.log("appBox width",ReactDOM.findDOMNode(this.refs.appBox).offsetWidth);
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
      paddingBottom: this.props.width,
      //height: this.state.height,
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
    let image = this.props.logoURL === "" ?
        <div style={_.extend({},styles.noLogoBox,styles.boxBase)}>
          <div style={styles.noLogoText}>{this.props.appName[0]}</div>
        </div>
        :
        <div /* 如果image还没有load成功,就暂时显示appName首字,load成功后显示image */
            style={_.extend({}, styles.boxBase, !this.state.loaded ? {backgroundColor:"#87caff"}:null)}>
          <img src={this.props.logoURL}
               style={_.extend({},styles.logoImage,{opacity:this.state.loaded?1:0})}
               className="vertical-center horizontal-center"
               onLoad={()=>{this.setState({loaded:true})}}/>
          {this.state.loaded ? null : <div style={styles.noLogoText}>{this.props.appName[0]}</div>}
        </div>;

    switch (userEditStatus) {
      case "default":
        return image;
        break;
      case "register":
        return this.state.hovered ?
            <AvFiberNew style={_.extend({}, styles.boxHoverSVG, {fill:ZenColor.cyan})}/> : image;
        break;
      case "remove":
        return this.state.hovered ?
            <ContentRemove style={_.extend({}, styles.boxHoverSVG, {fill:ZenColor.white})}/> : image;
        break;
      case "config":
        return this.state.hovered ?
            <ActionSettings style={_.extend({}, styles.boxHoverSVG, {fill:ZenColor.white})}/> : image;
        break;
    }
  }
});

module.exports = AppBox;