/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up page component, called by "routes"
 *******************************************************************************/
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

const {ActionAccountCircle, NotificationEnhancedEncryption, ActionVerifiedUser} = SvgIcons;

const {
    Col,
    FormControls,
    Input,
    Popover,
    Overlay,
    } = ReactBootstrap;

const styles = {
    paper: {
        paddingTop: 0,
        paddingBottom: 50,
        textAlign: 'center',
        backgroundColor: ZenColor.grey1,
    },
    registerButton: {
        marginTop: 25,
        marginBottom: 10,
        width: "70%",
        maxWidth: 200,
    },
    logo: {
        display: "block",
        margin: "auto",
        height: 150,
    },
    primaryText: {
        color: ZenColor.cyan
    },
    secondaryText: {
        color: ZenColor.grey3,
        fontWeight: 100,
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
    tabItem: {
        cursor: "default",
    },
    contentCol: {
        float: "none",
        marginTop: 50,
        textAlign: "center"
    },
    errorText: {color: "#F44336", fontSize: 13, fontWeight: 100},
};

AuthJoinPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired,
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            floatingCellText: "",
            floatingCaptchaText: "",
            captchaBtn: "获取验证码",
            area: "cn",
            step: 1,
            finalCaptcha: "",
            finalPwd: "",
            finalCell: "",
            showConfirmBtn: false,
            verifyBtnDisable: false,
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
        const {messages} = this.context.intl;

        return (<div>

                <Col>
                    <Paper style={styles.paper} zDepth={0}>
                        <div>
                            <Tabs value={this.state.step}>
                                <Tab label="设置用户名"
                                     icon={<ActionAccountCircle className="horizontal-center"/>}
                                     value={1}
                                     style={styles.tabItem}
                                     selected={this.state.step===1}
                                >
                                    <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
                                        <div>
                                            <h2 style={styles.primaryText}>
                                                输入你的手机号{/*messages.login_haveAccount*/}
                                            </h2>
                                        </div>
                                        <br/>
                                        <div>
                                            <h6 style={styles.secondaryText}>
                                                {messages.login_haveAccount}<Link
                                                to="/loginMobile">{messages.login_signIn_low}</Link>
                                            </h6>
                                        </div>
                                        <form>
                                            <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                                            <input style={{display:"none"}} type="password"
                                                   name="fakepasswordremembered"/>

                                            <Col xs={2} xsOffset={2}>
                                                <DropDownMenu value={this.state.area}
                                                              style={{zIndex:1, fontFamily: "inherit"}}
                                                              underlineStyle = {{border:"none"}}
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

                                            <Col xs={6} style={styles.textInput}>
                                                <TextField
                                                    ref="userPhone"
                                                    style={{fontWeight:"300"}}
                                                    floatingLabelStyle={{fontWeight:"300"}}
                                                    errorText={this.state.floatingCellText}
                                                    inputStyle={{textAlign:"center"}}
                                                    onKeyPress={(e)=>{e.key === 'Enter' && this.handleRequestCode()}}
                                                />
                                            </Col>

                                            {/*Todo add captcha*/}
                                        </form>

                                        <RaisedButton label={/*messages.login_signUp*/this.state.captchaBtn}
                                                      onClick={this.handleRequestCode}
                                                      style={styles.registerButton}
                                                      secondary={true}
                                                      disabled={this.state.captchaBtn!=="获取验证码"}
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
                                                        hintText={/*messages*/"输入验证码"}
                                                        onKeyPress={(e)=>{e.key === 'Enter' && this.handleVerify()}}
                                                    />
                                                    <br/>
                                                    <RaisedButton label={/*messages.login_signUp*/"确认"}
                                                                  onClick={this.handleVerify}
                                                                  style={styles.registerButton}
                                                                  secondary={true}
                                                                  disabled={this.state.verifyBtnDisable}
                                                    />
                                                </div>
                                            ) : null}
                                    </Col>
                                </Tab>

                                <Tab label="填写帐号信息"
                                     icon={<NotificationEnhancedEncryption className="horizontal-center"/>}
                                     value={2}
                                     style={styles.tabItem}
                                     selected={this.state.step===2}
                                >
                                    <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
                                        <div>
                                            <h2 style={styles.primaryText}>
                                                设置核心密码{/*messages.login_haveAccount*/}
                                            </h2>
                                        </div>
                                        <div>
                                            <h4 style={_.extend({},styles.secondaryText,{marginTop:30})}>
                                                {/*messages.login_haveAccount*/
                                                    "你唯一需要记的密码"}
                                            </h4>
                                            <h6 style={styles.secondaryText}>
                                                {/*messages.login_haveAccount*/
                                                    "为保证你的安全，此密码采取不可逆加密方式，一旦设定无法取回，请务必牢记"}
                                            </h6>
                                        </div>
                                        <br/>
                                        <Col sm={6} smOffset={3} style={{float: "none"}}>
                                            <form>
                                                <input style={{display:"none"}} type="text"
                                                       name="fakeusernameremembered"/>
                                                <input style={{display:"none"}} type="password"
                                                       name="fakepasswordremembered"/>
                                                <Input type="password"
                                                       ref="password"
                                                       bsStyle={this.state.pwdVerified?"success":null}
                                                       label={/*message*/"核心密码"}
                                                       className="pwdInputStyle"
                                                       hasFeedback={true}
                                                       onFocus={e => this.setState({ target: e.target, showPopOver: true})}
                                                       onBlur={() => {
                                                            if (this.state.pwdVerified) {
                                                                this.setState({showPopOver: false, errorText: "" /*message*/})
                                                            } else {
                                                                this.setState({showPopOver: false, errorText: "核心密码不符合要求，请重新设置" /*message*/})
                                                            }
                                                       }}
                                                       onChange={this.handleInputPassword}
                                                       onKeyPress={(e)=>{e.key === 'Enter' && this.handleRegister()}}
                                                />

                                                {//Error text
                                                    this.state.errorText ?
                                                        <p style={styles.errorText}>
                                                            {this.state.errorText}
                                                        </p> : null
                                                }

                                                <Input type="password"
                                                       ref="password2"
                                                       bsStyle={this.state.twoPwdSame?"success":null}
                                                       label="再次输入"
                                                       hasFeedback={true}
                                                       onFocus={e => this.setState({ target: e.target, showPopOver2: true})}
                                                       onBlur={() => {
                                                            if (this.state.twoPwdSame) {
                                                                this.setState({showPopOver2: false, errorText2: "" /*message*/})
                                                            } else {
                                                                this.setState({showPopOver2: false, errorText2: "两次密码输入不一致, 请重新输入" /*message*/})
                                                            }
                                                       }}
                                                       onChange={this.handleInputPassword2}
                                                       onKeyPress={(e)=>{e.key === 'Enter' && this.handleRegister()}}
                                                />


                                                {//Error text
                                                    this.state.errorText2 ?
                                                        <p style={styles.errorText}>
                                                            {this.state.errorText2}
                                                        </p> : null
                                                }

                                                <Overlay
                                                    show={this.state.showPopOver}
                                                    target={()=> ReactDOM.findDOMNode(this.state.target)}
                                                    placement="right"
                                                    container={this}
                                                    containerPadding={20}
                                                >
                                                    <Popover title={/*message*/"密码要求"} id="password check"
                                                             style={{marginLeft:25}}>
                                                        6-20位
                                                        <br />
                                                        大写字母,小写字母,数字至少包含2种
                                                    </Popover>
                                                </Overlay>

                                                <Overlay
                                                    show={this.state.showPopOver2}
                                                    target={()=> ReactDOM.findDOMNode(this.state.target)}
                                                    placement="right"
                                                    container={this}
                                                    containerPadding={20}
                                                >
                                                    <Popover id="password check"
                                                             style={{marginLeft:25}}>
                                                        请再次输入登录密码
                                                    </Popover>
                                                </Overlay>

                                                <RaisedButton label={/*messages.login_signUp*/"确 定"}
                                                              onClick={this.handleRegister}
                                                              style={styles.registerButton}
                                                              secondary={true}
                                                              disabled={this.state.registerBtnDisable}
                                                />

                                                {/*Todo add captcha*/}
                                            </form>
                                        </Col>

                                        <br/>

                                    </Col>
                                </Tab>

                                <Tab label="注册成功"
                                     icon={<ActionVerifiedUser className="horizontal-center"/>}
                                     value={3}
                                     style={styles.tabItem}
                                     selected={this.state.step===3}
                                >
                                    <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
                                        <div>
                                            <h2 style={styles.primaryText}>
                                                恭喜你注册成功{/*messages.login_haveAccount*/}
                                            </h2>
                                            <br/>
                                            <h5>
                                                正在登录, 请稍候...
                                            </h5>

                                            <CircularProgress size={1}/>
                                        </div>
                                    </Col>
                                </Tab>
                            </Tabs>


                        </div>


                    </Paper>
                </Col>
            </div>
        );
    },

    handleInputErrorCheckUser(){
        let userPhone = this.refs.userPhone.getValue();
        //Todo uncomment when finish testing server error check
        if (!isValidateCell(this.state.area, userPhone)) {
            this.setState({floatingCellText: /*this.context.intl.messages.login_emailFormatError*/"手机号码格式不正确，请重新输入"});
        }
        else {
            this.setState({floatingCellText: ""});
            return true;
        }
        return false;
    },

    handleRequestCode(){
        /* Error check */
        const noInputError = this.handleInputErrorCheckUser();

        /* Save data & Handle login */
        let userPhone = this.refs.userPhone.getValue();
        let areaCode = this.state.area === "cn" ? "+86" : "+1";
        var cell = areaCode + userPhone;

        if (userPhone && noInputError) {//检查格式

            Meteor.call("cellUserAvailableCheck", cell, function (error) {//检查用户是否存在
                if (error) {
                    this.setState({floatingCellText: "用户已经存在, 请直接登录"});
                    throw new Meteor.Error("error", error);
                } else {
                    //Start to send verification code
                    Accounts.requestPhoneVerification(cell, function (error) {
                        if (error) {
                            this.setState({floatingCellText: "短信发送过于频繁或超过限制"});
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
    },

    countdown(remaining) {
        if (remaining === 0) {
            this.setState({captchaBtn: "获取验证码"});
        } else {
            this.setState({captchaBtn: "重发验证码(" + remaining + "s)"});
            this.countDownTimer = setTimeout(function () {
                this.countdown(remaining - 1)
            }.bind(this), 1000);
        }
    },

    handleVerify(){
        this.setState({verifyBtnDisable: true});
        let userPhone = this.refs.userPhone.getValue();
        let areacode = this.state.area === "cn" ? "+86" : "+1";
        var cell = areacode + userPhone;

        const captcha = this.refs.captcha.getValue();
        Meteor.call("checkCaptcha", cell, captcha, function (error) {
            if (error) {
                this.setState({floatingCaptchaText: "校验码不正确，请重新输入", verifyBtnDisable: false});
                //throw new Meteor.Error("error", error);
            } else {
                //clearTimeout(this.countDownTimer);
                this.setState({step: 2, verifyBtnDisable: false, finalCaptcha: captcha, finalCell: cell});
                //console.log("verify successful!");
            }
        }.bind(this));
    },

    handleInputPassword(){
        const pwd = this.refs.password.refs.input.value;

        //Check password
        if (checkPassword(pwd)) {
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
            this.setState({errorText: "" /*message*/, step: 3, finalPwd: this.refs.password.refs.input.value},
                setTimeout(register.bind(this),2000));//添加2秒传递时间, 增加用户体验

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
            if (this.state.errorText==="" && this.state.errorText2===""){
                this.setState({errorText: "输入的核心密码不符合要求,请重新输入"/*messages*/})
            }
        }
    }
});
