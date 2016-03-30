const LanguageIcon = require('../header/LanguageIcon.jsx');
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

//Todo remove unnecessary require

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

  getInitialState(){
    return {
      area: "cn",
      disableAreaDropdown: true,
      floatingUserText: "",
      floatingCaptchaText: "",
      captchaBtn: "requestCaptcha-获取验证码",
      showConfirmBtn: false,
      verifyBtnDisable: false,
    }
  },

  render(){
    //messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    return (
        <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
          <div>
            <h2 style={styles.primaryText}>
              {messages["username-输入你的用户名"]}
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

            <Col xs={2} xsOffset={1}>
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

            <Col xs={6} style={styles.textInput}>
              <TextField
                  ref="phoneOrEmail"
                  style={{fontWeight: "300"}}
                  floatingLabelStyle={{fontWeight: "300"}}
                  errorText={this.state.floatingUserText}
                  inputStyle={{textAlign: "center"}}
                  onChange={this.handleTextFieldChange}
                  onKeyPress={(e)=> {e.key === 'Enter' && this.handleRequestValidation()}}
              />
            </Col>

            {/*Todo add captcha*/}
          </form>

          <RaisedButton label={messages["sendValidateEmail-发送验证邮件"]}
                        onClick={this.handleRequestValidation}
                        style={_.extend({},styles.registerButton,{visibility:this.state.disableAreaDropdown?"visible":"hidden"})}
                        secondary={true}
                        className={(this.state.disableAreaDropdown?"fadeInUp":"fadeOutUp")+ " animated"}
          />

          <RaisedButton label={typeof this.state.captchaBtn === "string" ?
            messages[this.state.captchaBtn] : this.state.captchaBtn}
                        onClick={this.handleRequestValidation}
                        style={_.extend({}, styles.registerButton, {marginTop:"-20px", visibility:this.state.disableAreaDropdown?"hidden":"visible"})}
                        secondary={true}
                        disabled={this.state.captchaBtn !== "requestCaptcha-获取验证码"}
                        className={(!this.state.disableAreaDropdown?"fadeInDown":"fadeOutDown")+ " animated"}
          />
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
                      //inputStyle={{textAlign:"center"}}
                      hintText={messages["inputCaptcha-输入验证码"]}
                      onKeyPress={(e)=>{e.key === 'Enter' && this.handleVerify()}}
                  />
                  <br/>
                  <RaisedButton label={messages["ok-确认"]}
                                onClick={this.handleVerify}
                                style={styles.registerButton}
                                secondary={true}
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
      Meteor.call("createUserByEmail", userEmail, function (error) {
        if (error) {
          console.log("error", error);
          this.setState({disableBtn: false, floatingUserText: error.error + " " + error.reason});
        } else {
          console.log("一封邮件已经发送到你邮箱,请查收");
        }
      }.bind(this));
    };

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
        if (!OctoAPI.isValidateCell(this.state.area, phoneOrEmail)) {
          this.setState({floatingUserText: messages["mobileFormatError-手机错误"]});
        }
        else {
          this.setState({floatingUserText: ""});
          return true;
        }
        return false;
      } else {//If it is email
        if (!OctoAPI.isValidateEmail(phoneOrEmail)) {
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
      console.log(this, remaining);
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
    let userPhone = this.refs.userPhone.getValue();
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
        this.setState({step: 1, verifyBtnDisable: false, finalCaptcha: captcha, finalCell: cell});
        //console.log("verify successful!");
      }
    }.bind(this));
  },


  //Meteor.call("sendVerifyCode", cell);

  //check if email is available
  /*Meteor.call("emailIsAvailable", email, function(error, emailAvailable){
   console.log("error",error);
   console.log("emailAvailable",emailAvailable);
   if (emailAvailable)
   {
   console.log("email is available");
   }
   else  {
   console.log("email is not available");
   }
   });*/


  /*if (email && noInputError) {
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
   }*/

});


module.exports = JoinStep1;