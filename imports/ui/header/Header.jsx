/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Header component, called by "App" component
 *******************************************************************************/
import React from "react";
import _ from "lodash";
import Paper from "material-ui/Paper";
import Col from "antd/lib/col";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import {Link} from "react-router";

import {ZenRawTheme} from "../../../client/globals/theme";
var LanguageIcon = require('../header/LanguageIcon.jsx');
var HeaderLogo = require('./HeaderLogo.jsx');
const guestAllowedLink = ["/login", "/reset", "/join"];

const styles = {
  tab: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: ZenColor.white,
  },
  headerSVG: {
    height: 64,
  },

  languageItem: {
    position: "absolute",
    display: "block",
    width: "32px",
    height: "24px",
    left: "14px",
    margin: "10px",
  },
  inkBar: {
    //height: "4px",
    //top: "8px",
    width: "10%",
    marginLeft: "6.7%",
    backgroundColor: ZenColor.blue,
    transform: "translateX(50%)",
    //':hover': {
    //    backgroundColor: 'red'
    //},
  },
  appBar: {
    marginTop: "-68px",
    boxShadow: "0 1px 16px rgba(0, 0, 0, 0.18)",
    backgroundColor: ZenRawTheme.palette.primary4Color,
    zIndex: "auto",
  }
};

var Header = React.createClass({
  propTypes: {
    location: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  mixins: [ReactMeteorData],

  getInitialState(){
    return {
      routeValue: "/login",
    }
  },

  getMeteorData(){
    return {
      currentUser: Meteor.user(),
    }
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      routeValue: nextProps.location.pathname
    });
  },

  handleTabChange(value) {
    //console.log("handleTabChange");
    if (this.data.currentUser) {//用户已经登录
      if (value === "/login") {
        Meteor.logout(function (err) {
          //console.log("userId = " + Meteor.userId());
          this.setState({routeValue: value}, function (error) {
            this.context.router.push(value);
          }.bind(this))
        }.bind(this))
      } else {
        this.setState({routeValue: value}, function () {
          this.context.router.push(value);
        }.bind(this));
      }
    }
    else if (_.indexOf(guestAllowedLink, value) > -1) {//是任何人都可以访问的link
      this.setState({routeValue: value}, function () {
        this.context.router.push(value);
      }.bind(this));
    } else {//无权限访问, 把tab换回之前的位置
      this.setState({routeValue: this.state.routeValue})
    }
  },

  render(){
    messages = this.context.intl.messages.header;

    let account;
    //console.log("this.data.currentUser", this.data.currentUser);

    if (this.data.currentUser && this.data.currentUser.emails &&
        this.data.currentUser.emails.length > 0) {
      account = this.data.currentUser.emails[0].address;
    } else if (this.data.currentUser && this.data.currentUser.phone) {
      account = this.data.currentUser.phone.number;
    }

    //console.log("account", account);
    return (<Paper style={{display: "flex", position: "relative",
    boxShadow: "0 0px 12px rgba(0, 0, 0, 0.18)", backgroundColor:"white"}}>
          <Col xs={4}>
            <HeaderLogo/>
          </Col>

          <Col xs={{ span: 16, offset: 2 }}>
            <Menu onClick={this.handleClick}
                  selectedKeys={[this.state.routeValue]}
                  style={{fontSize: "14px", fontWeight: 200, lineHeight:"60px"}}
                  mode="horizontal">

              {this.data.currentUser ?
                  <SubMenu title={<span><Icon type="setting" />{messages["account-账户"]}</span>}>
                    <MenuItemGroup title={account}>
                      <Menu.Item key="/login">{messages["logout-登出"]}</Menu.Item>
                    </MenuItemGroup>
                  </SubMenu>

                  : <Menu.Item key="/login">
                <Icon type="solution"/>{messages["login-登录"]}
              </Menu.Item>
              }

              <Menu.Item key="/list" style={{marginLeft:"25%", marginRight:"12.5%"}}>
                <Icon type="home"/>{messages["mySites-我的网站"]}
              </Menu.Item>

              <Menu.Item key="/catalog" style={{marginLeft:"12.5%"}}>
                <Icon type="appstore-o"/>{messages["allSites-所有网站"]}
              </Menu.Item>

            </Menu>
          </Col>
        </Paper>

    )
  },

  handleClick(e) {
    this.handleTabChange(e.key);
  },
});

module.exports = Header;