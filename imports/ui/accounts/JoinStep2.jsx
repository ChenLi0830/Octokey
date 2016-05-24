/*******************************************************************************
 * Copyright (C) 2015 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up Step 2, called by "JoinPage"
 *******************************************************************************/
import React from "react";

import RaisedButton from "material-ui/RaisedButton";

import Button from "antd/lib/button"
import Steps from "antd/lib/steps"
import Form from "antd/lib/form"
import Input from "antd/lib/input"
import Popover from "antd/lib/popover"
import Col from "antd/lib/col"
const FormItem = Form.Item;

import _ from "lodash";

var Actions = require("../action-and-stores/Actions.jsx");

const styles = {
  contentCol: {
    float: "none",
    marginTop: 50,
    textAlign: "center",
  },
  primaryText: {
    color: ZenColor.cyan,
    fontWeight: "300",
    lineHeight: "50px",
  },
  secondaryText: {
    color: ZenColor.grey3,
    fontWeight: 100,
  },
  registerButton: {
    marginTop: 25,
    //marginBottom: 10,
    width: "70%",
    maxWidth: 200,
  },
};

//Used in callback 'onStepComplete'
let isUsingEmail = true;

var JoinStep2 = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  propTypes: {
    finalUserName: React.PropTypes.string.isRequired,
    finalCaptcha: React.PropTypes.string,
    registerUsingEmail: React.PropTypes.bool.isRequired,
    onStepComplete: React.PropTypes.func.isRequired,
  },

  getInitialState(){
    return {
      pwdVerified: false,
      twoPwdSame: false,
      errorText: "",
      errorText2: "",
      registerBtnDisable: false,
    }
  },


  render(){
    //messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    return (
        <Col sm={{ span: 16, offset: 4}} md={{ span: 12, offset: 6}} xs={24} style={styles.contentCol}>
          <div>
            <h1 style={styles.primaryText}>
              {messages["setMasterPWD-设置核心密码"]}
            </h1>
          </div>
          <div>
            <h2 style={_.extend({}, styles.secondaryText, {fontSize: "15px"})}>
              {messages["msg-唯一要记的密码"]}
            </h2>
            <h4 style={styles.secondaryText}>
              {messages["msg-核心密码无法取回"]}
            </h4>
          </div>
          <br/>
          <Form horizontal>
            <input style={{display: "none"}} type="text"
                   name="fakeusernameremembered"/>
            <input style={{display: "none"}} type="password"
                   name="fakepasswordremembered"/>

            <FormItem
                label={messages["masterPWD-核心密码"]}
                hasFeedback={true}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                validateStatus={this.state.errorText!==""?"error": this.state.pwdVerified ? "success" : ""}
                help={this.state.errorText}>
              <Popover placement="right" title={messages["pwdRequirement-密码要求"]}
                       content={<div>{messages["pwdLength-密码长度"]}<br />{messages["pwdFormat-密码格式"]}</div>}
                       trigger="focus">

                <Input type="password"
                       ref="password"
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur1}
                       onChange={this.handleInputPassword}
                />
              </Popover>
            </FormItem>


            <FormItem
                label={messages["inputPWDAgain-再次输入"]}
                hasFeedback={true}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                validateStatus={this.state.errorText2!==""? "error": this.state.twoPwdSame ? "success" : ""}
                help={this.state.errorText2}>
              <Popover placement="right" title={messages["pwdRequirement-密码要求"]}
                       overlay={messages["pwdConfirmPopover-pop再次输入"]}
                       trigger="focus">
                <Input type="password"
                       ref="password2"
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur2}
                       onChange={this.handleInputPassword2}
                />
              </Popover>
            </FormItem>

          </Form>

          <RaisedButton label={messages["ok-确认"]}
                        onClick={this.handleRegister}
                        style={styles.registerButton}
                        primary={ true }
                        disabled={this.state.registerBtnDisable}
          />

          {/*Todo add captcha*/}

          <br/>

        </Col>
    )
  },

  handleInputPassword(){
    const pwd = this.refs.password.refs.input.value;
    //console.log("pwd",pwd);
    //Check password
    if (OctoClientAPI.checkPassword(pwd)) {
      this.setState({pwdVerified: true, errorText: ""});
      return true;
    } else {
      this.setState({pwdVerified: false});
      return false;
    }
  },

  handleInputPassword2(){
    const pwd = this.refs.password.refs.input.value;
    const pwd2 = this.refs.password2.refs.input.value;
    if (pwd === pwd2) {
      this.setState({twoPwdSame: true, errorText2: ""});
      return true;
    } else {
      this.setState({twoPwdSame: false});
      return false;
    }
  },

  pwdOnBlur1(){
    if (this.state.pwdVerified) {
      this.setState({showPopOver: false, errorText: "" /*message*/})
    } else {
      this.setState({showPopOver: false, errorText: messages["pwdFormatError-密码格式有误"]})
    }
  },

  pwdOnBlur2(){
    if (this.state.twoPwdSame) {
      this.setState({showPopOver2: false, errorText2: ""})
    } else {
      this.setState({showPopOver2: false, errorText2: messages["pwdNotMatch-两次密码不一致"]})
    }
  },

  handleRegister(){
    //if no errors, go to step 3, create account
    const hasError = !this.handleInputPassword() || !this.handleInputPassword2();

    if (hasError) {// Has input error
      if (this.state.errorText === "" && this.state.errorText2 === "") {
        this.setState({errorText: messages["unknownError-两次输入的密码有误"]})
      }
      return;
    }

    const {finalUserName, finalCaptcha, registerUsingEmail} = this.props;
    const finalPwd = this.refs.password.refs.input.value;

    if (finalUserName && finalPwd && finalCaptcha || registerUsingEmail) {
      this.setState({errorText: ""});

      if (registerUsingEmail) {// Register using email
        setEmailPassword.call(this, finalUserName, finalPwd);
      } else {//Register using Mobile
        setMobilePassword.call(this, finalUserName, finalCaptcha, finalPwd);
      }
    }
    //Set finalPwd to Actions to get encryptionKey later
    Actions.setPassword(finalPwd);

    function setEmailPassword(finalUserName, finalPwd) {
      Meteor.call("setEmailPassword", finalUserName, finalPwd, function (error) {
        if (error) {
          console.log("error");
          this.setState({errorText: T9n.get('error.accounts.'+error.reason)});
        } else {
          this.props.onStepComplete(finalPwd);
        }
      }.bind(this));
    }

    function setMobilePassword(finalUserName, finalCaptcha, finalPwd) {
      Meteor.call("setMobilePassword", finalUserName, finalCaptcha, finalPwd, function (error) {
        if (error) {
          console.log("error");
          this.setState({errorText: T9n.get('error.accounts.'+error.reason)});
        } else {
          this.props.onStepComplete(finalPwd);
        }
      }.bind(this));
    }
  },

});


module.exports = JoinStep2;