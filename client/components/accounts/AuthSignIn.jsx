/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/
var LanguageIcon = require('../header/LanguageIcon.jsx');

const Link = ReactRouter.Link;

const {
    Paper,
    FlatButton,
    TextField,
    RaisedButton,
    DropDownMenu,
    MenuItem,
    } = MUI;

const {
    Col,
    } = ReactBootstrap;

const {FormattedMessage} = ReactIntl;

const styles = {
  paper: {
    padding: "30px 30px 50px 30px",
    //paddingTop: 30,
    //paddingBottom: 50,
    textAlign: 'center',
    backgroundColor: ZenColor.grey1,
  },
  logo: {
    display: "block",
    margin: "auto",
    height: 150,
  },
  loginMessage: {
    lineHeight: "60px",
    fontWeight: "500",
    fontSize: "16px",
    color: "#666",
  },
  languageItem: {
    position: "absolute",
    display: "block",
    width: "32px",
    height: "24px",
    left: "8px",
    margin: "10px",
    top: "-8px"
  },
  textInput: {
    marginTop: 8,
    paddingLeft: 0,
    left: -36,
  },
  menuItem: {
    fontSize: 13,
    fontFamily: "inherit",
  },
  dropDownMenu: {
    zIndex: 1,
    fontFamily: "inherit",
    left: -20
  },
  registerButton: {
    marginTop: 25,
    marginBottom: 10,
    width: "70%",
    maxWidth: 200,
  },
  changeLoginButton: {
    marginTop: 10,
    marginBottom: 10,
    width: "70%",
    maxWidth: 200,
  },
};

var AuthSignIn = React.createClass({
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
    };
  },

  componentWillUnmount() {
    clearTimeout(this.countDownTimer);
  },

  render() {
    messages = this.context.intl.messages.signIn;
    const logo = (
        <Link to="/"><img style={styles.logo} src="/img/logo.png"/></Link>
    );

    return (<Col sm={6} smOffset={3} md={4} mdOffset={4} xs={12}>
          <Paper style={styles.paper} zDepth={1}>
            <form >

              {logo}

              <h2 style={styles.loginMessage}>
                {messages["login-账户登录"]}
              </h2>

              <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
              <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

              <Col xs={2}>
                <DropDownMenu value={this.state.area}
                              style={_.extend({},styles.dropDownMenu, {visibility:this.state.disableAreaDropdown?"hidden":"visible"})}
                              underlineStyle={{border:"none"}}
                              onChange={(e, index, value)=>{this.setState({area:value})}}>
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

              <Col xs={10} style={styles.textInput}>
                <TextField
                    ref="phoneOrEmail"
                    style={{fontWeight:"300",left:5}}
                    floatingLabelStyle={{fontWeight:"300"}}
                    errorText={this.state.floatingUserText}
                    inputStyle={{textAlign:"center"}}
                    hintText={messages["emailOrMobile-邮箱或手机号"]}
                    hintStyle={{textAlign:"center", width:"100%"}}
                    onChange={this.handleTextFieldChange}
                    onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                    autoComplete="false"
                />
              </Col>

              <br/>
              <TextField
                  ref="password"
                  type="password"
                  style={{fontWeight:"300"}}
                  floatingLabelStyle={{fontWeight:"300"}}
                  errorText={this.state.floatingPassText}
                  inputStyle={{textAlign:"center"}}
                  hintText={messages["password-密码"]}
                  hintStyle={{textAlign:"center", width:"100%"}}
                  onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                  autoComplete="false"
              />


              { //短信验证
                /*<div>

                 <RaisedButton label={typeof this.state.captchaBtn === "string"?
                 messages[this.state.captchaBtn]:this.state.captchaBtn}
                 onClick={this.handleRequestCode}
                 style={styles.registerButton}
                 primary={true}
                 disabled={this.state.captchaBtn!=="requestCaptcha-获取验证码"}
                 />

                 <br/>

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
                 <Link style={{display:"block", marginTop:"10px"}} to="/reset">
                 {messages["forgotpwd-忘记密码"]}
                 </Link>
                 </div>*/
              }
            </form>

            <RaisedButton label={messages["signIn-登录"]}
                          onClick={this.handleSubmit}
                          style={styles.registerButton}
                          primary={true}
                          disabled={this.state.disableBtn}/>

            <p>{messages["noAccount-还没帐号"]}
              <Link to="/join">{messages["signUp_low-注册"]}</Link>
            </p>
          </Paper>
        </Col>
    );
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.getValue();
    if (!password) {
      this.setState({floatingPassText: messages["pwdEmpty-密码不能空"]});
    } else {
      this.setState({floatingPassText: ""});
      return true;
    }
    return false;
  },

  handleSubmit(){
    /* Error check */
    const noInputError = this.handleInputErrorCheckUser() && this.handleInputErrorCheckPass();

    /* Save data & Handle login */
    let phoneOrEmail = this.refs.phoneOrEmail.getValue();

    let areaCode = this.state.area === "cn" ? "+86" : "+1";
    var cell = areaCode + phoneOrEmail;

    let password = this.refs.password.getValue();

    //短信验证
    /*let captcha = this.refs.captcha.getValue();

     Meteor.call("checkCaptcha", cell, captcha, function (error) {
     if (error) {
     this.setState({floatingCaptchaText: "校验码不正确，请重新输入", verifyBtnDisable: false});
     //throw new Meteor.Error("error", error);
     } else {*/

    if (phoneOrEmail && password && noInputError) {
      this.setState({disableBtn: true});

      if (this.state.disableAreaDropdown) {//login using email
        Meteor.loginWithPassword(phoneOrEmail, password, (error) => {
          if (error) {
            this.setState({disableBtn: false, floatingPassText: T9n.get('error.accounts.'+error.reason)});
            //console.log("error: ", error);
            return;
          }
          Actions.setPassword(password);
          this.context.router.push('/list');
        });
      } else {//login using mobile
        Meteor.loginWithPhoneAndPassword({phone: cell}, password, (error) => {
          if (error) {
            this.setState({disableBtn: false, floatingPassText: T9n.get('error.accounts.'+error.reason)});
            //console.log("error: ", error);
            return;
          }
          Actions.setPassword(password);
          this.context.router.push('/list');
        });
      }
    }
    /*}
     }.bind(this));*/
  },

  handleInputErrorCheckUser(){
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
});

module.exports = AuthSignIn;