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
    } = MUI;

const {ActionAccountCircle, NotificationEnhancedEncryption, ActionVerifiedUser} = SvgIcons;

const {
    Col
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
        color: ZenColor.grey3
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
            showConfirmBtn: false,
            verifyBtnDisable:false,
        };
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
                                                to="/login">{messages.login_signIn_low}</Link>
                                            </h6>
                                        </div>
                                        <form>
                                            <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                                            <input style={{display:"none"}} type="password"
                                                   name="fakepasswordremembered"/>

                                            <Col xs={2} xsOffset={2}>
                                                <DropDownMenu value={this.state.area}
                                                              style={{zIndex:1, fontFamily: "inherit"}}
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
                                            this.state.showConfirmBtn || true ? (
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
                                />

                                <Tab label="注册成功"
                                     icon={<ActionVerifiedUser className="horizontal-center"/>}
                                     value={3}
                                     style={styles.tabItem}
                                     selected={this.state.step===3}
                                />
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

        if (userPhone && noInputError) {//如果格式没错,就发送验证码
            let areacode = this.state.area === "cn" ? "+86" : "+1";

            var cell = areacode + userPhone;
            //console.log("send message to ", cell);
            console.log("this", this);
            //this.countdown(60);

            Accounts.requestPhoneVerification(cell, function (error) {
                if (error) {
                    this.setState({floatingCellText: "短信发送过于频繁或超过限制"});
                    //throw new Meteor.Error("error", error);
                }
                this.countdown(60);
                this.setState({showConfirmBtn: true});
                const tempUser = Meteor.user();
                console.log("tempUser", tempUser);

                //出现一个验证码输入框,和完成验证按钮
                console.log("finish sending text to " + userPhone);
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
            setTimeout(function () {
                this.countdown(remaining - 1)
            }.bind(this), 1000);
        }
    },

    handleVerify(){
        this.setState({verifyBtnDisable:true});
        let userPhone = this.refs.userPhone.getValue();
        let areacode = this.state.area === "cn" ? "+86" : "+1";
        var cell = areacode + userPhone;

        const captcha = this.refs.captcha.getValue();
        Meteor.call("checkCaptcha", cell, captcha, function (error) {
            if (error) {
                this.setState({floatingCaptchaText: "校验码不正确，请重新输入", verifyBtnDisable:false});
                //throw new Meteor.Error("error", error);
            } else {
                this.setState({step: 2, verifyBtnDisable:false});
                //console.log("verify successful!");
            }
        }.bind(this));
    },
});
