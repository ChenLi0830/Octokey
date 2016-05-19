/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/ import React from "react"
var LanguageIcon = require('../header/LanguageIcon.jsx');

import {Link} from "react-router";
import _ from "lodash";
import {RaisedButton} from "material-ui";
//var Actions = require("../action-and-stores/Actions.jsx");

import { Row, Col, Input, Select, Form } from 'antd';

const FormItem = Form.Item;

const InputGroup = Input.Group;
const Option = Select.Option;

import {FormattedMessage} from "react-intl";

var Actions = require("../action-and-stores/Actions.jsx");

const styles = {
  doorStripBase: {
    backgroundColor: "#f6f7f8",
    height: "100%",
    width: "25px",
    border: "1px solid #C5C5C5",
    transform: "translateX(1px)",
    borderTop: "none",
    borderBottom: "none",
    transitionDuration:"1s",
  },

  doorStripLeft: {
    float: "right",
    borderRightColor: "#9EA7AB",
  },

  doorStripRight: {
    float: "left",
    borderLeftColor: "#9EA7AB",
  },

  lockFixedPart: {
    position: "absolute",
    //display: inline,
    left: "100%",
    zIndex: "1",
    top: "40%",
    width: "200px",
    transform: "translateX(-50%) translateY(-48%)",
    transition: "opacity 0.5s ease",
  },

  lockRotatePart: {
    position: "absolute",
    //display: inline,
    left: "100%",
    zIndex: "2",
    top: "40%",
    width: "178px",
    //WebkitTransition: "0.2s", /* Safari */
    transition: "all 0.3s ease, opacity 0.5s ease",
  },

  registerButton: {
    marginTop: "15px",
    width: "100%",
  },

  input: {
    height: "38px",
    fontSize: "14px",
  },
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
      loginSuccessful: false,
      lockPartsLoaded:0,//如果lockPartsLoaded===2表示两张图都load好了
    };
  },

  componentWillUnmount() {
    clearTimeout(this.countDownTimer);
  },

  render() {
    //disableAreaDropdown
    messages = this.context.intl.messages.signIn;
    //console.log("messages", messages);
    const logo = (
        <Link to="/"><img style={styles.logo} src="/img/"/></Link>
    );
    const lockTransform = "translateX(-50%) translateY(-50%)" + "rotate(" + this.state.rotateAngle +
        "deg)";

    return (<div style={{height:"100%"}}>
          <Row style={{height:"100%"}}>
            <Col span="7" style={{height:"100%"}} className={this.state.loginSuccessful ? "animated fadeOutLeft":""}>
              <div id="leftDoor" style={{backgroundColor:"#eceff1", height:"100%"}}>
                <div id="leftStrip"
                     style={_.extend({}, styles.doorStripBase, styles.doorStripLeft, {opacity:this.state.lockPartsLoaded===2?1:0})}>
                </div>
                <img style={_.extend({}, styles.lockFixedPart, {opacity:this.state.lockPartsLoaded===2?1:0})}
                     src="/img/lock_stable.png"
                     onLoad={()=>{this.setState({lockPartsLoaded:this.state.lockPartsLoaded+1})}}/>
                <img id="rotateLock"
                     style={_.extend({}, styles.lockRotatePart, {transform: lockTransform}, {opacity:this.state.lockPartsLoaded===2?1:0})}
                     src="/img/lock_rotate.png" onClick={this.handleRotateLock}
                     onLoad={()=>{this.setState({lockPartsLoaded:this.state.lockPartsLoaded+1})}}/>
              </div>
            </Col>

            <Col span="17" style={{height:"100%"}} className={this.state.loginSuccessful ? "animated fadeOutRight":""}>
              <div id="rightDoor" style={{backgroundColor:"#eceff1", height:"100%"}}>
                <div id="rightStrip"
                     style={_.extend({}, styles.doorStripBase, styles.doorStripRight, {opacity:this.state.lockPartsLoaded===2?1:0})}>
                </div>

                <Col span="6" offset="4"
                     style={{top: "40%", transform: "translateY(-80px)"}}
                    /*className="animated fadeOutLeft"*/ >

                  <FormItem
                      validateStatus={this.state.floatingUserText===""?"":"error"}
                      help={this.state.floatingUserText}>
                    <InputGroup style={{width:"100%"}}>
                      {
                        !this.state.disableAreaDropdown ?
                            <div className="ant-input-group-wrap" id="phoneUsername">
                              <Select value={this.state.area} style={{ width: 80 }}
                                      onSelect={this.handleSelectArea}>
                                <Option value="cn">中国+86</Option>
                                <Option value="ca">USA+1</Option>
                                <Option value="us">Canada+1</Option>
                              </Select>
                            </div> : null
                      }
                      <Input id="phoneOrEmail" ref="phoneOrEmail" placeholder="请输入邮箱或手机号"
                             hasFeedback
                             style={!this.state.disableAreaDropdown ? {borderRadius: "0 5px 5px 0", height:"38px", fontSize:"14px"}:{borderRadius: "5px", height:"38px", fontSize:"14px"}}
                             validateStatus={this.state.floatingUserText===""?"":"error"}
                             onChange={this.handleTextFieldChange}
                             onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                             help={this.state.floatingUserText}
                      />
                    </InputGroup>
                  </FormItem>


                  <FormItem
                      validateStatus={this.state.floatingPassText===""?"":"error"}
                      help={this.state.floatingPassText}>
                    <Input ref="password"
                           placeholder="请输入您的密码"
                           type="password"
                           autoComplete="off"
                           style={styles.input}
                           onBlur={this.pwdOnBlur1}
                           onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit();e.key !== 'Enter' && this.handleRotateLock()}}
                    />
                  </FormItem>

                  <RaisedButton label={messages["signIn-登录"]}
                                onClick={this.handleSubmit}
                                style={styles.registerButton}
                                primary={true}
                                disabled={this.state.disableBtn}/>

                </Col>
              </div>
            </Col>

          </Row>
        </div>
    );
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.refs.input.value;
    if (!password) {
      this.setState({floatingPassText: messages["pwdEmpty-密码不能空"]});
    } else {
      this.setState({floatingPassText: ""});
      return true;
    }
    return false;
  },

  handleInputErrorCheckUser(){
    let phoneOrEmail = this.refs.phoneOrEmail.refs.input.value;
    //console.log("phoneOrEmail", phoneOrEmail);
    //console.log("this.state.disableAreaDropdown", this.state.disableAreaDropdown);

    //Todo need to check error on server side as well
    //If it is cellnumber
    if (!this.state.disableAreaDropdown) {
      if (!OctoClientAPI.isValidateCell(this.state.area, phoneOrEmail)) {
        this.setState({floatingUserText: messages["mobileFormatError-手机错误"]});
      }
      else {
        this.setState({floatingUserText: ""});
        return true;
      }
      return false;
    } else {//If it is email
      if (!OctoClientAPI.isValidateEmail(phoneOrEmail)) {
        this.setState({floatingUserText: messages["emailFormatError-邮箱错误"]});
      }
      else {
        this.setState({floatingUserText: ""});
        return true;
      }
      return false;
    }
  },

  handleSubmit(){
    //console.log("handleSubmit");
    /* Error check */
    const noInputError = this.handleInputErrorCheckUser() && this.handleInputErrorCheckPass();

    //console.log("noInputError", noInputError);
    /* Save data & Handle login */
    let phoneOrEmail = this.refs.phoneOrEmail.refs.input.value;

    let areaCode = this.state.area === "cn" ? "+86" : "+1";
    var cell = areaCode + phoneOrEmail;

    let password = this.refs.password.refs.input.value;

    //短信验证
    /*let captcha = this.refs.captcha.getValue();

     Meteor.call("checkCaptcha", cell, captcha, function (error) {
     if (error) {
     this.setState({floatingCaptchaText: "校验码不正确，请重新输入", verifyBtnDisable: false});
     //throw new Meteor.Error("error", error);
     } else {*/

    if (phoneOrEmail && password && noInputError) {
      this.setState({disableBtn: true});

      //console.log("phoneOrEmail, password", phoneOrEmail, password);
      if (this.state.disableAreaDropdown) {//login using email
        Meteor.loginWithPassword(phoneOrEmail, password, (error) => {
          if (error) {
            this.setState(
                {
                  disableBtn: false,
                  rotateAngle: -720,
                  floatingPassText: T9n.get('error.accounts.' + error.reason)
                });
            //console.log("error: ", error);
            return;
          }
          this.setState({loginSuccessful:true});
          //setTimeout(()=>{//等动画结束就切换link
            Actions.setPassword(password);
            this.context.router.push('/list');
          //},1000);
        });
      } else {//login using mobile
        Meteor.loginWithPhoneAndPassword({phone: cell}, password, (error) => {
          if (error) {
            this.setState(
                {
                  disableBtn: false,
                  rotateAngle: -720,
                  floatingPassText: T9n.get('error.accounts.' + error.reason)
                });
            //console.log("error: ", error);
            return;
          }
          this.setState({loginSuccessful:true});
          //setTimeout(()=>{
            Actions.setPassword(password);
            this.context.router.push('/list');
          //},1000);

        });
      }
    }
    /*}
     }.bind(this));*/
  },

  countdown(remaining) {
    if (remaining === 0) {
      this.setState({captchaBtn: "requestCaptcha-获取验证码"});
    } else {
      this.setState({
        captchaBtn: <FormattedMessage id="resendCaptcha-重发验证码" values={{remaining:remaining}}/>
      });
      this.countDownTimer = setTimeout(function () {
        this.countdown(remaining - 1)
      }.bind(this), 1000);
    }
  },

  handleRotateLock(){
    //console.log("handleRotateLock");
    const angle = Math.random() * 180 - 90;
    this.setState({rotateAngle: this.state.rotateAngle + angle});
  },

  handleTextFieldChange(){
    //console.log("this.refs.phoneOrEmail", this.refs.phoneOrEmail);
    let phoneOrEmail = this.refs.phoneOrEmail.refs.input.value;
    var isNum = /^\d+$/.test(phoneOrEmail);
    if (!isNum) {
      this.setState({disableAreaDropdown: true});
    }
    else {
      this.setState({disableAreaDropdown: false})
    }
  },

  handleSelectArea(selectedValue){
    //console.log("selectedValue", selectedValue);
    this.setState({area: selectedValue});
  },

});

module.exports = AuthSignInNew;