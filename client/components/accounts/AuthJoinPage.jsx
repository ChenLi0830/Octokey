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
    IconButton
    } = MUI;

const {
    Col
    } = ReactBootstrap;

const styles = {
    paper: {
        paddingTop: 30,
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
    }
};

AuthJoinPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired,
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            floatingUserText: "",
            disableBtn: false,
            area: "cn",
        };
    },

    render() {
        const {messages} = this.context.intl;

        return (<Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12}>
                {<Paper style={styles.paper} zDepth={0}>
                    <div>
                        <h2 style={styles.primaryText}>
                            输入你的手机号{/*messages.login_haveAccount*/}
                        </h2>
                    </div>
                    <br/>
                    <div>
                        <h6 style={styles.secondaryText}>
                            {messages.login_haveAccount}<Link to="/login">{messages.login_signIn_low}</Link>
                        </h6>
                    </div>
                    <form>
                        <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                        <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

                        <Col xs={2} xsOffset={2}>
                            <DropDownMenu value={this.state.area}
                                          style={{zIndex:1, fontFamily: "inherit"}}
                                          onChange={(e, index, value)=>{this.setState({area:value})}}>
                                <MenuItem leftIcon={<LanguageIcon style={styles.languageItem} iconName="cn"/>}
                                          primaryText="中国  (+86)" label="+86" value="cn" style={styles.menuItem}
                                />
                                <MenuItem leftIcon={<LanguageIcon style={styles.languageItem} iconName="ca"/>}
                                          primaryText="Canada  (+1)" label="+1" value="ca" style={styles.menuItem}
                                />
                                <MenuItem leftIcon={<LanguageIcon style={styles.languageItem} iconName="us"/>}
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
                                errorText={this.state.floatingUserText}
                                inputStyle={{textAlign:"center"}}
                                onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                            />
                        </Col>

                        {/*Todo add captcha*/}
                    </form>

                    <RaisedButton label={/*messages.login_signUp*/"获取验证码"}
                                  onClick={this.handleSubmit}
                                  style={styles.registerButton}
                                  secondary={true}
                                  disabled={this.state.disableBtn}
                    />
                </Paper>}
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let userPhone = this.refs.userPhone.getValue();
        //Todo uncomment when finish testing server error check
        if (!isValidateCell(this.state.area, userPhone)) {
            this.setState({floatingUserText: /*this.context.intl.messages.login_emailFormatError*/"手机号格式有错"});
        }
        else {
            this.setState({floatingUserText: ""});
            return true;
        }
        return false;
    },

    handleSubmit(){
        /* Error check */
        const noInputError = this.handleInputErrorCheckUser();

        /* Save data & Handle login */
        let userPhone = this.refs.userPhone.getValue();

        if (userPhone && noInputError) {//如果格式没错,就发送验证码
            let areacode = this.state.area === "cn" ? "+86" : "+1";

            var cell = areacode + userPhone;
            //console.log("send message to ", cell);
            Accounts.requestPhoneVerification(cell, function (error) {
                if (error) {
                    throw new Meteor.Error("error", error);
                }
                //出现一个验证码输入框,和完成验证按钮
                console.log("finish sending text to " + userPhone);
            });
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
    }
});
