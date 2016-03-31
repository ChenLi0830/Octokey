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
var JoinStep2Mobile = require('./JoinStep2Mobile.jsx');
var JoinStep3 = require('./JoinStep3.jsx');
const Link = ReactRouter.Link;

const {
    Paper,
    } = MUI;

const {
    ActionAccountCircle,
    NotificationEnhancedEncryption,
    ActionVerifiedUser
    } = SvgIcons;

const {
    Col,
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

  logo: {
    display: "block",
    margin: "auto",
    height: 150,
  },

  tabItem: {
    cursor: "default",
  },

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
      step: 0,
      finalCaptcha: "",
      finalPwd: "",
      finalMobile: "",
      isUsingEmail: false,
    };
  },


  render() {
    messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    let contentOfStep = this.getContentForEachStep();

    console.log("contentOfStep", contentOfStep);

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
    contentOfStep[0] = <JoinStep1 onStepComplete={this.onStep1Complete}/>;

    if (this.state.isUsingEmail) {//Register using Email

    } else {//Register using Mobile
      contentOfStep[1] = <JoinStep2Mobile finalMobile={this.state.finalMobile}
                                          finalCaptcha={this.state.finalCaptcha}
                                          onStepComplete={this.onStep2Complete}
      />;
      contentOfStep[2] = <JoinStep3 onStepComplete={this.onStep3Complete}/>;
    }
    return contentOfStep;
  },

  onStep1Complete(newState){
    this.setState({
      step: 1,
      finalCaptcha: newState.finalCaptcha,
      finalMobile: newState.finalMobile,
      isUsingEmail: newState.isUsingEmail,
    });
  },

  onStep2Complete(finalPwd){
    this.setState({
      step:2,
      finalPwd: finalPwd,
    });
  },

  onStep3Complete(){
    Meteor.loginWithPhoneAndPassword(this.state.finalMobile, this.state.finalPwd, ()=>{
      this.context.router.push('/list');
    });
  },
});

module.exports = JoinUsingMobilePage;