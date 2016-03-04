/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-in page component, called by "routes"
 *******************************************************************************/
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

const styles = {
    paper: {
        padding: "30px 30px 50px 30px",
        //paddingTop: 30,
        //paddingBottom: 50,
        textAlign: 'center',
        backgroundColor: ZenColor.grey1,
    },
    registerButton: {
        marginTop: 25,
        marginBottom: 10,
        width: "100%",
    },
    logo: {
        display: "block",
        margin: "auto",
        height: 150,
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
    dropDownMenu: {zIndex: 1, fontFamily: "inherit", left: -20},
    registerButton: {
        marginTop: 25,
        marginBottom: 10,
        width: "70%",
        maxWidth: 200,
    },
};

AuthSignInMobile = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired,
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            floatingPassText: "",
            floatingCellText: "",
            floatingCaptchaText: "",
            disableBtn: false,
            area: "cn",
            captchaBtn: "获取验证码",
        };
    },

    componentWillUnmount() {
        clearTimeout(this.countDownTimer);
    },

    render() {

        const {messages} = this.context.intl;
        const logo = (
            <Link to="/"><img style={styles.logo} src="/img/logo.svg"/></Link>
        );

        return (<Col sm={6} smOffset={3} md={4} mdOffset={4} xs={12}>
                <Paper style={styles.paper} zDepth={1}>
                    <form >

                        {logo}

                        <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                        <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

                        <Col xs={2}>
                            <DropDownMenu value={this.state.area}
                                          style={styles.dropDownMenu}
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
                                ref="userPhone"
                                style={{fontWeight:"300",left:5}}
                                floatingLabelStyle={{fontWeight:"300"}}
                                errorText={this.state.floatingCellText}
                                inputStyle={{textAlign:"center"}}
                                hintText={"手机号"/*messages.login_password*/}
                                hintStyle={{textAlign:"center", width:"100%"}}
                                onKeyPress={(e)=>{e.key === 'Enter' && this.handleRequestCode()}}
                            />
                        </Col>
                        {/*<TextField
                         ref="cell"
                         style={{fontWeight:"300"}}
                         floatingLabelStyle={{fontWeight:"300"}}
                         errorText={this.state.floatingUserText}
                         hintText={"手机号"/!*messages.login_email*!/}
                         onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                         />*/}
                        <br/>
                        <TextField
                            ref="password"
                            type="password"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingPassText}
                            inputStyle={{textAlign:"center"}}
                            hintText={messages.login_password}
                            hintStyle={{textAlign:"center", width:"100%"}}
                            onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                        />


                        {/* 短信验证
                         <div>

                         <RaisedButton label={/!*messages.login_signUp*!/this.state.captchaBtn}
                         onClick={this.handleRequestCode}
                         style={styles.registerButton}
                         secondary={true}
                         disabled={this.state.captchaBtn!=="获取验证码"}
                         />

                         <br/>

                         <TextField
                         ref="captcha"
                         style={{fontWeight:"300", width:90}}
                         floatingLabelStyle={{fontWeight:"300"}}
                         errorText={this.state.floatingCaptchaText}
                         //inputStyle={{textAlign:"center"}}
                         hintText={/!*messages*!/"输入验证码"}
                         onKeyPress={(e)=>{e.key === 'Enter' && this.handleVerify()}}
                         />
                         <br/>
                         <Link style={{display:"block", marginTop:"10px"}} to="/reset">
                         {messages.login_forgotpwd}
                         </Link>
                         </div>*/
                        }
                    </form>

                    <RaisedButton label={messages.login_signIn}
                                  onClick={this.handleSubmit}
                                  style={styles.registerButton}
                                  secondary={true}
                                  disabled={this.state.disableBtn}/>

                    <p>{messages.login_noAccount}
                        <Link to="/join">{messages.login_signUp_low}</Link>
                    </p>

                    <br/>
                    <p>or</p>

                    <RaisedButton label={/*messages.login_signIn*/"使用邮箱登录"}
                                  onClick={this.handleSwitchToMail}
                                  style={styles.registerButton}
                                  primary={true}>
                    </RaisedButton>
                </Paper>
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let cell = this.refs.userPhone.getValue();
        if (!isValidateCell(this.state.area, cell)) {
            this.setState({floatingCellText: /*this.context.intl.messages.login_emailFormatError*/"手机号码格式不正确，请重新输入"});
        }
        else {
            this.setState({floatingCellText: ""});
            return true;
        }
        return false;
    },

    handleInputErrorCheckPass(){
        let password = this.refs.password.getValue();
        if (!password) {
            this.setState({floatingPassText: this.context.intl.messages.login_pwdEmpty});
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
        let userPhone = this.refs.userPhone.getValue();
        let areaCode = this.state.area === "cn" ? "+86" : "+1";
        var cell = areaCode + userPhone;

        let password = this.refs.password.getValue();

        //短信验证
        /*let captcha = this.refs.captcha.getValue();

         Meteor.call("checkCaptcha", cell, captcha, function (error) {
         if (error) {
         this.setState({floatingCaptchaText: "校验码不正确，请重新输入", verifyBtnDisable: false});
         //throw new Meteor.Error("error", error);
         } else {*/
        if (userPhone && password && noInputError) {
            this.setState({disableBtn: true});
            console.log("cell", cell, "password", password);
            Meteor.loginWithPhoneAndPassword({phone: cell}, password, (error) => {
                if (error) {
                    this.setState({disableBtn: false, floatingPassText: error.error + " " + error.reason});
                    //console.log("error: ", error);
                    return;
                }
                Actions.setPassword(password);
                this.context.router.push('/list');
            });
        }
        /*}
         }.bind(this));*/
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
            //Start to send verification code
            Accounts.requestPhoneVerification(cell, function (error) {
                if (error) {
                    this.setState({floatingCellText: "短信发送过于频繁或超过限制"});
                    throw new Meteor.Error("error", error);
                }
                this.countdown(60);
            }.bind(this));
        }
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

    handleSwitchToMail(){
        this.context.router.push('/loginEmail');
    },
});
