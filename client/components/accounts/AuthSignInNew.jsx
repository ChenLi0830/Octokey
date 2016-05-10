/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/
var LanguageIcon = require('../header/LanguageIcon.jsx');
//var {Grid,Row,Col} = ReactBootstrap;

const Link = ReactRouter.Link;

const {
    Paper,
    FlatButton,
    TextField,
    RaisedButton,
    DropDownMenu,
    MenuItem,
    } = MUI;

import { Row, Col } from 'antd';


const {FormattedMessage} = ReactIntl;

const styles = {
  doorStripBase: {
    backgroundColor: "#f6f7f8",
    height: "100%",
    width: "20px",
    border: "1px solid #C5C5C5",
    transform: "translateX(1px)",
    borderTop: "none",
    borderBottom: "none",
  },

  doorStripLeft:{
    float: "right",
    borderRightColor:"#9EA7AB",
  },

  doorStripRight:{
    float: "left",
    borderLeftColor:"#9EA7AB",
  },

  lockFixedPart:{
    position: "absolute",
    display: "inline",
    left: "37.5%",
    top: "40%",
    width: "250px",
    transform: "translateX(-50%) translateY(-48%)",
  },

  lockRotatePart:{
    position: "absolute",
    display: "inline",
    left: "37.5%",
    top: "40%",
    width: "222px",
    transform: "translateX(-50%) translateY(-50%)",
  }
};

var AuthSignInNew = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      floatingPassText: "",
      floatingUserText: "",
      floatingCaptchaText: "",
      disableBtn: false,
      disableAreaDropdown: true,
      area: "cn",
      captchaBtn: "requestCaptcha-获取验证码",
      rotateAngle: 0,
    };
  },

  componentWillUnmount() {
    clearTimeout(this.countDownTimer);
  },

  render() {
    messages = this.context.intl.messages.signIn;
    const logo = (
        <Link to="/"><img style={styles.logo} src="/img/"/></Link>
    );

    return (<div style={{height:"100%"}}>
        <Row style={{height:"100%"}}>
          <Col span="9" style={{height:"100%"}} /*className="animated fadeOutLeft"*/ >
            <div id="leftDoor" style={{backgroundColor:"#eceff1", height:"100%"}}>
              <div id="leftStrip" style={_.extend({}, styles.doorStripBase, styles.doorStripLeft)}>

              </div>
            </div>
          </Col>
          <Col span="15" style={{height:"100%"}} /*className="animated fadeOutRight"*/ >
            <div id="rightDoor" style={{backgroundColor:"#eceff1", height:"100%"}}>
              <div id="rightStrip" style={_.extend({}, styles.doorStripBase, styles.doorStripRight)}>

              </div>
            </div>
          </Col>
        </Row>
          <img style = {styles.lockFixedPart} src="/img/lock_stable.png"/>
          <img id="rotateLock" style = {_.extend({}, styles.lockRotatePart, {transform: "translateX(-50%)" +
           " translateY(-50%)" + "rotate("+this.state.rotateAngle+"deg)"})} src="/img/lock_rotate.png" onClick={this.handleRotateLock}/>


        </div>
    );
  },

  handleRotateLock(){
    console.log("handleRotateLock");
    const angle = Math.random()*180-90;
    this.setState({rotateAngle:this.state.rotateAngle+angle});
  },
});

module.exports = AuthSignInNew;