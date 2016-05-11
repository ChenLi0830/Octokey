/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-5-11
 *
 * Header component, called by "App" component
 *******************************************************************************/
var LanguageIcon = require('../header/LanguageIcon.jsx');
var AccountTab = require('../accounts/AccountTab.jsx');
var HeaderLogo = require('./HeaderLogo.jsx');
const {
    Navbar,
    Nav,
    Col,
    } = ReactBootstrap;

import { Menu, Icon, Button } from 'antd';

const {Link} = ReactRouter;

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
          <Col xs={6}>
            <HeaderLogo/>
          </Col>

          <Col md={1} mdOffset={5} xs={2} xsOffset={4}>
            {button}
          </Col>
        </div>

    )
  },

});

module.exports = UnloginHeader;