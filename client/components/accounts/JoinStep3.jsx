/*******************************************************************************
 * Copyright (C) 2015 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up Step 1, called by "JoinPage"
 *******************************************************************************/

const LanguageIcon = require('../header/LanguageIcon.jsx');

const {
    CircularProgress,
    } = MUI;

const {Col} = ReactBootstrap;

const styles = {
  contentCol: {
    float: "none",
    marginTop: 50,
    textAlign: "center",
  },
  primaryText: {
    color: ZenColor.cyan,
    fontWeight: "300"
  },
  secondaryText: {
    color: Colors.grey800,
    fontWeight: 100,
  }
};

var JoinStep3 = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  propTypes: {
    onStepComplete: React.PropTypes.func.isRequired,
  },

  getInitialState(){
    return {
      area: "cn",
      disableAreaDropdown: true,
      floatingUserText: "",
      floatingCaptchaText: "",
      captchaBtn: "requestCaptcha-获取验证码",
      showConfirmBtn: true,
      verifyBtnDisable: false,
    }
  },

  render(){
    messages = this.context.intl.messages.join;
    //Show step 3 for 1500ms.
    this.initiateUser();
    return <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
      <div>
        <h1 style={styles.primaryText}>
          {messages["signUpSuccess-注册成功"]}
        </h1>
        <br/>
        <h3 style={styles.secondaryText}>
          {messages["plzWait-正在登录请稍候"]}
        </h3>
        <CircularProgress size={1}/>
      </div>
    </Col>
  },

  initiateUser(){
    Meteor.call("initiateUser", function (error) {
      if (error) {
        console.log("error", error);
      } else {
        this.props.onStepComplete();
        //setTimeout(this.props.onStepComplete, 1500);
      }
    }.bind(this));
  },
});


module.exports = JoinStep3;