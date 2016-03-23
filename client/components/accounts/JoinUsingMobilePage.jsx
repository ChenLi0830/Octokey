/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up page component, called by "routes"
 *******************************************************************************/
var LanguageIcon = require('../header/LanguageIcon.jsx');

const Link = ReactRouter.Link;

//Todo: separate 3 steps into 3 components

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
        color: ZenColor.cyan,
        fontWeight: "300"
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
        textAlign: "center",
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
            floatingCellText: "",
            floatingCaptchaText: "",
            captchaBtn: "requestCaptcha-获取验证码",
            area: "cn",
            step: 0,
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
        messages = this.context.intl.messages.join;
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

    handleInputErrorCheckUser(){
        let userPhone = this.refs.userPhone.getValue();
        //Todo uncomment when finish testing server error check
        if (!OctoAPI.isValidateCell(this.state.area, userPhone)) {
            this.setState({floatingCellText: messages["mobileFormatError-手机错误"]});
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
                    this.setState({floatingCellText: messages["userExists-用户已经存在"]});
                    throw new Meteor.Error("error", error);
                } else {
                    //Start to send verification code
                    Accounts.requestPhoneVerification(cell, function (error) {
                        if (error) {
                            this.setState({floatingCellText: messages["captchaRequestExceeds-短信太频繁"]});
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

    getContentForEachStep(){
        let contentOfStep = [];
        contentOfStep[0] = (
            <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
                <div>
                    <h2 style={styles.primaryText}>
                        {messages["mobile-输入你的手机号"]}
                    </h2>
                </div>
                <br/>
                <div>
                    <h4 style={styles.secondaryText}>
                        {messages["haveAccount-已有帐号"]}<Link
                        to="/login">{messages["signIn_low-登录"]}</Link>

                        {", " + messages["orJoinUsingEmail-或者用邮箱"]}<Link
                        to="/joinEmail">{messages["registerUsingEmail-注册"]}</Link>
                    </h4>
                </div>
                <form>
                    <input style={{display: "none"}} type="text" name="fakeusernameremembered"/>
                    <input style={{display: "none"}} type="password"
                           name="fakepasswordremembered"/>

                    <Col xs={2} xsOffset={1}>
                        <DropDownMenu value={this.state.area}
                                      style={{zIndex: 1, fontFamily: "inherit"}}
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
                            ref="userPhone"
                            style={{fontWeight: "300"}}
                            floatingLabelStyle={{fontWeight: "300"}}
                            errorText={this.state.floatingCellText}
                            inputStyle={{textAlign: "center"}}
                            onKeyPress={(e)=> {e.key === 'Enter' && this.handleRequestCode()}}
                        />
                    </Col>

                    {/*Todo add captcha*/}
                </form>

                <RaisedButton label={typeof this.state.captchaBtn === "string" ?
            messages[this.state.captchaBtn] : this.state.captchaBtn}
                              onClick={this.handleRequestCode}
                              style={styles.registerButton}
                              secondary={true}
                              disabled={this.state.captchaBtn !== "requestCaptcha-获取验证码"}
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
        );

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

    countdown(remaining) {
        if (remaining === 0) {
            this.setState({captchaBtn: "requestCaptcha-获取验证码"});
        } else {
            this.setState({captchaBtn: <FormattedMessage id="resendCaptcha-重发验证码" values={{remaining: remaining}}/>});
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
                this.setState({floatingCaptchaText: messages["captchaNotCorrect-校验码不正确"], verifyBtnDisable: false});
                //throw new Meteor.Error("error", error);
            } else {
                //clearTimeout(this.countDownTimer);
                this.setState({step: 1, verifyBtnDisable: false, finalCaptcha: captcha, finalCell: cell});
                //console.log("verify successful!");
            }
        }.bind(this));
    },

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
            this.setState({errorText: "" /*message*/, step: 2, finalPwd: this.refs.password.refs.input.value},
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