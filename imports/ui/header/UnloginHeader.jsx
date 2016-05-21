/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-5-11
 *
 * Header component, called by "App" component
 *******************************************************************************/ import React from "react"
var LanguageIcon = require('../header/LanguageIcon.jsx');
var HeaderLogo = require('./HeaderLogo.jsx');
import {
    Col,
    } from "antd";

import { Menu, Icon, Button } from 'antd';

import {Link} from "react-router";

const styles = {
  container: {
    position: "fixed",
    width: "100%",
    top: "0px",
    zIndex: "2",
  },
  buttonStyle: {
    lineHeight: "30px",
    marginTop: "10px",
    color: ZenColor.blueGrey,
    fontSize: "12px",
  }
};

var UnloginHeader = React.createClass({
  propTypes: {
    location: React.PropTypes.object.isRequired,
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  render(){
    messages = this.context.intl.messages.header;

    //console.log("this.props.location.pathname", this.props.location.pathname);

    //右上角的Btn
    let btnLink, btnTitle;
    if (this.props.location.pathname==='/login' || this.props.location.pathname==='/'){
      btnLink = '/join';
      btnTitle = '注册';
    } else if (this.props.location.pathname==='/join'){
      btnLink = '/login';
      btnTitle = '登录';
    } else {//这个不应该出现, 放在这只是防错
      btnLink = '/';
      btnTitle = '首页';
    }
    const button = <Link to={btnLink}>
      <Button type="dashed" style={styles.buttonStyle}>
        {btnTitle}
      </Button>
    </Link>;
    //console.log("account", account);
    return (<div style={styles.container}>
          <Col xs={12}>
            <HeaderLogo/>
          </Col>

          <Col md={{ span: 2, offset: 10 }} xs={{ span: 4, offset: 8 }}>
            {button}
          </Col>
        </div>

    )
  },

});

module.exports = UnloginHeader;