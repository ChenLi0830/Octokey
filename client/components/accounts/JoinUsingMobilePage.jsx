/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up page component, called by "routes"
 *******************************************************************************/
//var LanguageIcon = require('../header/LanguageIcon.jsx');
var JoinStep1 = require('./JoinStep1.jsx');

const Link = ReactRouter.Link;

const {
    Paper,
    FlatButton,
    TextField,
    RaisedButton,
    DropDownMenu,
    MenuItem,
    IconMenu,
    IconButton,
    Tabs,
    Tab,
    FontIcon,
    Divider,
    CircularProgress,
    } = MUI;

const {
    ActionAccountCircle,
    NotificationEnhancedEncryption,
    ActionVerifiedUser
    } = SvgIcons;

const {FormattedMessage} = ReactIntl;

const {
    Col,
    FormControls,
  //Input,
  //Popover,
    Overlay,
    } = ReactBootstrap;

import {
    Button,
    Steps,
    Form,
    Input,
    Popover
} from 'antd';

const FormItem = Form.Item;

const Step = Steps.Step;

const styles = {
  paper: {
    paddingTop: 50,
    paddingBottom: 50,
    backgroundColor: ZenColor.grey1,
  },
  //dropDownMenu: {
  //    zIndex: 1,
  //    fontFamily: "inherit",
  //    left: -20
  //},
  //registerButton: {
  //    marginTop: 25,
  //    marginBottom: 10,
  //    width: "70%",
  //    maxWidth: 200,
  //},
  logo: {
    display: "block",
    margin: "auto",
    height: 150,
  },
  //primaryText: {
  //    color: ZenColor.cyan,
  //    fontWeight: "300"
  //},
  //secondaryText: {
  //    color: ZenColor.grey3,
  //    fontWeight: 100,
  //},
  //languageItem: {
  //    position: "absolute",
  //    display: "block",
  //    width: "32px",
  //    height: "24px",
  //    left: "8px",
  //    margin: "10px",
  //    top: "-8px"
  //},
  //textInput: {
  //    marginTop: 8,
  //    paddingLeft: 0,
  //    left: -36,
  //},
  //menuItem: {
  //    fontSize: 13,
  //    fontFamily: "inherit",
  //},
  tabItem: {
    cursor: "default",
  },
  //contentCol: {
  //    float: "none",
  //    marginTop: 50,
  //    textAlign: "center",
  //},
  paperCol: {
    float: "none",
  },
  errorText: {color: "#F44336", fontSize: 13, fontWeight: 100},
  steps: {textAlign: "left"}
};

var JoinUsingMobilePage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      //floatingUserText: "",
      //floatingCaptchaText: "",
      //disableAreaDropdown:true,
      //captchaBtn: "requestCaptcha-获取验证码",
      //area: "cn",
      step: 0,
      finalCaptcha: "",
      finalPwd: "",
      finalCell: "",
      //showConfirmBtn: false,
      //verifyBtnDisable: false,
      showPopOver: false,
      showPopOver2: false,
      pwdVerified: false,
      twoPwdSame: false,
      errorText: "",
      errorText2: "",
    };
  },

  componentWillUnmount() {
    clearTimeout(this.countDownTimer);
  },

  render() {
    messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    let contentOfStep = this.getContentForEachStep();

    const steps = [{
      title: messages["stepUsername-设置用户名"],
      //description: '这里是多信息的描述啊'
    }, {
      title: messages["stepAccountInfo-填写帐号信息"],
      //description: '这里是多信息的耶哦耶哦哦耶哦耶'
    }, {
      title: messages["stepSuccessful-注册成功"],
      //description: '描述啊描述啊'
    }].map((s, i) => <Step key={i} title={s.title} description={s.description}/>);

    return (<div>
          <Col style={{backgroundColor:ZenColor.grey1}}>
            <Paper style={styles.paper} zDepth={0}>
              <Col sm={8} smOffset={2} md={8} mdOffset={2} xs={12} style={styles.paperCol}>
                <div style={{textAlign:"left"}}>
                  <Steps current={this.state.step} className="antdsteps">{steps}</Steps>
                  {this.state.step === 0 && contentOfStep[0]}
                  {this.state.step === 1 && contentOfStep[1]}
                  {this.state.step === 2 && contentOfStep[2]}
                </div>
              </Col>
            </Paper>
          </Col>
        </div>
    );
  },

  //handleInputErrorCheckUser(){
  //  let phoneOrEmail = this.refs.phoneOrEmail.getValue();
  //  //Todo need to check error on server side as well
  //  //If it is cellnumber
  //  if (!this.state.disableAreaDropdown) {
  //    if (!OctoAPI.isValidateCell(this.state.area, phoneOrEmail)) {
  //      this.setState({floatingUserText: messages["mobileFormatError-手机错误"]});
  //    }
  //    else {
  //      this.setState({floatingUserText: ""});
  //      return true;
  //    }
  //    return false;
  //  } else {//If it is email
  //    if (!OctoAPI.isValidateEmail(phoneOrEmail)) {
  //      this.setState({floatingUserText: messages["emailFormatError-邮箱错误"]});
  //    }
  //    else {
  //      this.setState({floatingUserText: ""});
  //      return true;
  //    }
  //    return false;
  //  }
  //},

/*  handleRequestValidation(){
    /!* Error check *!/
    const noInputError = this.handleInputErrorCheckUser();

    /!* Save data & Handle login *!/
    if (this.state.disableAreaDropdown) {//SignUp attempt using Email
      validateEmail.call(this);
    } else {//SignUp attempt using Mobile
      validateMobile.call(this);
    }

    function validateMobile() {
      console.log("this.refs", this.refs);
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
              this.countdown(60);
              this.setState({showConfirmBtn: true});

              //出现一个验证码输入框,和完成验证按钮
              console.log("finish sending text to " + userPhone);
            }.bind(this));
          }
        }.bind(this));
      }
    }

    //check if email is available
    /!*Meteor.call("emailIsAvailable", email, function(error, emailAvailable){
     console.log("error",error);
     console.log("emailAvailable",emailAvailable);
     if (emailAvailable)
     {
     console.log("email is available");
     }
     else  {
     console.log("email is not available");
     }
     });*!/


    /!*if (email && noInputError) {
     this.setState({disableBtn: true});

     Meteor.call("createUserByEmail",email, function (error){
     if (error){
     console.log("error",error);
     this.setState({disableBtn: false, floatingUserText: error.error + " " + error.reason});
     } else {
     console.log("一封邮件已经发送到你邮箱,请查收");
     }
     //console.log("userId",userId);
     }.bind(this));


     /!*            Accounts.createUser({
     email: email,
     //password: password
     }, (error) => {
     if (error) {
     this.setState({disableBtn: false, floatingUserText: error.error + " " + error.reason});
     console.log("error: ", error);
     //alert("error: " + error);
     return;
     }
     Meteor.call("initiateUser", function(){
     Actions.setPassword(password);
     this.context.router.push('/list');
     }.bind(this));
     });*!/
     }*!/
  },*/

  getContentForEachStep(){
    let contentOfStep = [];
    contentOfStep[0] = <JoinStep1/>;

    contentOfStep[1] = (
        <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
          <div>
            <h1 style={styles.primaryText}>
              {messages["setMasterPWD-设置核心密码"]}
            </h1>
          </div>
          <div>
            <h2 style={_.extend({}, styles.secondaryText, {marginTop: 30})}>
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                validateStatus={this.state.errorText!==""?"error": this.state.pwdVerified ? "success" : ""}
                help={this.state.errorText}>
              <Popover placement="right" title={messages["pwdRequirement-密码要求"]}
                       overlay={<div>{messages["pwdLength-密码长度"]}<br />{messages["pwdFormat-密码格式"]}</div>}
                       trigger="focus"
              >
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
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
                        secondary={true}
                        disabled={this.state.registerBtnDisable}
          />

          {/*Todo add captcha*/}

          <br/>

        </Col>
    );
    contentOfStep[2] = (
        <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
          <div>
            <h1 style={styles.primaryText}>
              {messages["signUpSuccess-注册成功"]}
            </h1>
            <br/>
            <h3>
              {messages["plzWait-正在登录请稍候"]}
            </h3>
            <CircularProgress size={1}/>
          </div>
        </Col>
    );

    return contentOfStep;
  },

/*  //Check if it only contains number, if not, disable area selection
  handleTextFieldChange(){
    let phoneOrEmail = this.refs.phoneOrEmail.getValue();

    var isNum = /^\d+$/.test(phoneOrEmail);
    if (!isNum) {
      this.setState({disableAreaDropdown: true});
    }
    else {
      this.setState({disableAreaDropdown: false})
    }
  },*/

/*  countdown(remaining) {
    if (remaining === 0) {
      this.setState({captchaBtn: "requestCaptcha-获取验证码"});
    } else {
      this.setState({
        captchaBtn: <FormattedMessage id="resendCaptcha-重发验证码" values={{remaining: remaining}}/>
      });
      this.countDownTimer = setTimeout(function () {
        this.countdown(remaining - 1)
      }.bind(this), 1000);
    }
  },*/

/*
  handleVerify(){
    this.setState({verifyBtnDisable: true});
    let userPhone = this.refs.userPhone.getValue();
    let areacode = this.state.area === "cn" ? "+86" : "+1";
    var cell = areacode + userPhone;

    const captcha = this.refs.captcha.getValue();
    Meteor.call("checkCaptcha", cell, captcha, function (error) {
      if (error) {
        this.setState(
            {floatingCaptchaText: messages["captchaNotCorrect-校验码不正确"], verifyBtnDisable: false});
        //throw new Meteor.Error("error", error);
      } else {
        //clearTimeout(this.countDownTimer);
        this.setState({step: 1, verifyBtnDisable: false, finalCaptcha: captcha, finalCell: cell});
        //console.log("verify successful!");
      }
    }.bind(this));
  },
*/

  handleInputPassword(){
    const pwd = this.refs.password.refs.input.value;
    //console.log("pwd",pwd);
    //Check password
    if (OctoAPI.checkPassword(pwd)) {
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

  handleRegister(){
    //if no errors, go to step 3, create account
    const noError = this.handleInputPassword() && this.handleInputPassword2();

    if (noError) {
      this.setState(
          {errorText: "" /*message*/, step: 2, finalPwd: this.refs.password.refs.input.value},
          setTimeout(register.bind(this), 2000));//添加2秒传递时间, 增加用户体验

      function register() {
        const {finalCell,finalCaptcha,finalPwd} = this.state;
        if (finalCell && finalCaptcha && finalPwd) {
          //Todo, 加上验证信息 - > 刚刚有人发送了验证码,如果不是本人操作请报告.
          Accounts.verifyPhone(finalCell, finalCaptcha, finalPwd, function (error) {
            if (error) {
              throw new Meteor.Error("error", error);
            }
            Meteor.call("initiateUser", function (error) {
              if (error) {
                throw new Meteor.Error("error", error);
              }
              this.context.router.push("/list");
            }.bind(this));
          }.bind(this))
        }
        Actions.setPassword(finalPwd);
      }
    }
    else {
      if (this.state.errorText === "" && this.state.errorText2 === "") {
        this.setState({errorText: messages["unknownError-两次输入的密码有误"]})
      }
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
  }
});

module.exports = JoinUsingMobilePage;