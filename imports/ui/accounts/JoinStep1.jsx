/*******************************************************************************
 * Copyright (C) 2015 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@octokeyteam.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up Step 1, called by "JoinPage"
 *******************************************************************************/
import React from "react";
import {Link} from "react-router";
import _ from "lodash";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Col from "antd/lib/col";

import {FormattedMessage} from "react-intl";


const LanguageIcon = require('../header/LanguageIcon.jsx');

const styles = {
  languageItem: {
    position: "absolute",
    display: "block",
    width: "32px",
    height: "24px",
    left: "8px",
    margin: "10px",
    top: "-8px"
  },
  menuItem: {
    fontSize: 13,
    fontFamily: "inherit",
  },
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
    color: ZenColor.grey3,
    fontWeight: 100,
  },
  dropDownMenu: {
    zIndex: 1,
    fontFamily: "inherit",
    left: -20
  },
  textInput: {
    marginTop: 8,
    paddingLeft: 0,
    left: -36,
  },
  registerButton: {
    marginTop: 25,
    //marginBottom: 10,
    width: "70%",
    maxWidth: 200,
  },
};

var JoinStep1 = React.createClass({
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
      captchaBtn: "sendValidation-发送验证",
      showConfirmBtn: false,
      verifyBtnDisable: false,
    }
  },

  componentDidMount(){
    this.refs.phoneOrEmail.focus()
  },

  componentWillUnmount() {
    clearTimeout(this.countDownTimer);
  },

  render(){
    messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    return (
        <Col sm={{ span: 16, offset: 4}} md={{ span: 12, offset: 6}} xs={24} style={styles.contentCol}>
          <div>
            <h2 style={styles.primaryText}>
              {messages["register-账户注册"]}
            </h2>
          </div>
          <br/>
          <div>
            <h4 style={styles.secondaryText}>
              {messages["haveAccount-已有帐号"]}<Link
                to="/login">{messages["signIn_low-登录"]}</Link>
            </h4>
          </div>
          <form>
            <input style={{display: "none"}} type="text" name="fakeusernameremembered"/>
            <input style={{display: "none"}} type="password"
                   name="fakepasswordremembered"/>

            <Col xs={{ span: 4, offset: 2}}>
              <DropDownMenu value={this.state.area}
                            style={_.extend({},styles.dropDownMenu, {visibility:this.state.disableAreaDropdown?"hidden":"visible"})}
                            underlineStyle={{border: "none"}}
                            onChange={(e, index, value)=> {this.setState({area: value})}}>
                <MenuItem
                    leftIcon={<LanguageIcon style={styles.languageItem} iconName="cn"/>}
                    primaryText="中国  (+86)" label="+86" value="cn"
                    style={styles.menuItem}
                />
                <MenuItem
                    leftIcon={<LanguageIcon style={styles.languageItem} iconName="ca"/>}
                    primaryText="Canada  (+1)" label="+1" value="ca"
                    style={styles.menuItem}
                />
                <MenuItem
                    leftIcon={<LanguageIcon style={styles.languageItem} iconName="us"/>}
                    primaryText="United States  (+1)" label="+1" value="us"
                    style={styles.menuItem}
                />
              </DropDownMenu>
            </Col>

            <Col xs={12} style={styles.textInput}>
              <TextField
                  ref="phoneOrEmail"
                  style={{fontWeight: "300"}}
                  floatingLabelStyle={{fontWeight: "300"}}
                  errorText={this.state.floatingUserText}
                  inputStyle={{textAlign: "center"}}
                  onChange={this.handleTextFieldChange}
                  hintText={messages["username-邮箱或手机"]}
                  hintStyle={{width:"100%"}}
                  onKeyPress={(e)=> {e.key === 'Enter' && this.handleRequestValidation()}}
              />
            </Col>

            {/*Todo add captcha*/}
          </form>

          {<RaisedButton label={typeof this.state.captchaBtn === "string" ?
            messages[this.state.captchaBtn] : this.state.captchaBtn}
                         onClick={this.handleRequestValidation}
                         style={_.extend({},styles.registerButton)}
                         primary={ true }
                         disabled={this.state.captchaBtn !== "sendValidation-发送验证" &&
                           this.state.captchaBtn !== "requestCaptcha-获取验证码"}
                         className={"animated fadeInUp"}
          />}

          <br/>
          <br/>

          {//Todo remove || true
            this.state.showConfirmBtn ? (
                <div>
                  <TextField
                      ref="captcha"
                      style={{fontWeight:"300", width:90}}
                      floatingLabelStyle={{fontWeight:"300"}}
                      errorText={this.state.floatingCaptchaText}
                      inputStyle={{textAlign:"center"}}
                      hintText={messages["inputCaptcha-输入验证码"]}
                      onKeyPress={(e)=>{e.key === 'Enter' && this.handleVerify()}}
                  />
                  <br/>
                  <RaisedButton label={messages["ok-确认"]}
                                onClick={this.handleVerify}
                                style={styles.registerButton}
                                primary={ true }
                                disabled={this.state.verifyBtnDisable}
                  />
                </div>
            ) : null}
        </Col>
    )
  },

  //Check if it only contains number, if not, disable area selection
  handleTextFieldChange(){
    let phoneOrEmail = this.refs.phoneOrEmail.getValue();

    var isNum = /^\d+$/.test(phoneOrEmail);
    if (!isNum) {
      this.setState({disableAreaDropdown: true});
    }
    else {
      this.setState({disableAreaDropdown: false})
    }
  },

  handleRequestValidation(){
    /* Error check */
    const noInputError = inputErrorCheckUser.call(this);

    if (!noInputError) {//Return if has error.
      return;
    }

    /* Save data & Handle login */
    if (this.state.disableAreaDropdown) {//SignUp attempt using Email
      validateEmail.call(this);
    } else {//SignUp attempt using Mobile
      validateMobile.call(this);
    }

    function validateEmail() {
      let userEmail = this.refs.phoneOrEmail.getValue();
      this.setState({captchaBtn: "validationSent-提交中"});

      Meteor.call("createUserByEmail", userEmail, function (error) {
        if (error) {
          console.log("error", error);
          this.setState({
            disableBtn: false,
            floatingUserText: T9n.get('error.accounts.'+error.reason),
            captchaBtn: "sendValidation-发送验证",
          });
        } else {
          this.props.onStepComplete({
            finalEmail: userEmail,
            isUsingEmail: true
          });
          //console.log("一封邮件已经发送到你邮箱,请查收");
        }
      }.bind(this));
    };

    function validateMobile() {
      let userPhone = this.refs.phoneOrEmail.getValue();
      let areaCode = this.state.area === "cn" ? "+86" : "+1";
      var cell = areaCode + userPhone;

      if (userPhone && noInputError) {//检查格式

        Meteor.call("cellUserAvailableCheck", cell, function (error) {//检查用户是否存在
          if (error) {
            this.setState({floatingUserText: messages["userExists-用户已经存在"]});
            throw new Meteor.Error("error", error);
          } else {
            //Start to send verification code
            Accounts.requestPhoneVerification(cell, function (error) {
              if (error) {
                this.setState({floatingUserText: messages["captchaRequestExceeds-短信太频繁"]});
                throw new Meteor.Error("error", error);
              }
              countdown.call(this, 60);
              this.setState({showConfirmBtn: true});

              //出现一个验证码输入框,和完成验证按钮
              console.log("finish sending text to " + userPhone);
            }.bind(this));
          }
        }.bind(this));
      }
    };

    function inputErrorCheckUser() {
      let phoneOrEmail = this.refs.phoneOrEmail.getValue();
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
    };

    function countdown(remaining) {
      if (remaining === 0) {
        this.setState({captchaBtn: "requestCaptcha-获取验证码"});
      } else {
        this.setState({
          captchaBtn: <FormattedMessage id="resendCaptcha-重发验证码" values={{remaining: remaining}}/>
        });
        this.countDownTimer = setTimeout(function () {
          countdown.call(this, remaining - 1)
        }.bind(this), 1000);
      }
    };
  },

  handleVerify(){
    this.setState({verifyBtnDisable: true});
    let userPhone = this.refs.phoneOrEmail.getValue();
    let areaCode = this.state.area === "cn" ? "+86" : "+1";
    var cell = areaCode + userPhone;

    const captcha = this.refs.captcha.getValue();
    Meteor.call("checkCaptcha", cell, captcha, function (error) {
      if (error) {
        this.setState(
            {floatingCaptchaText: messages["captchaNotCorrect-校验码不正确"], verifyBtnDisable: false});
        //throw new Meteor.Error("error", error);
      } else {
        //clearTimeout(this.countDownTimer);
        this.setState({verifyBtnDisable: false});

        this.props.onStepComplete({
          finalCaptcha: captcha,
          finalMobile: cell,
          isUsingEmail: false
        });
        //console.log("verify successful!");
      }
    }.bind(this));
  },
});


module.exports = JoinStep1;