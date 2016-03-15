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
    RaisedButton
    } = MUI;

const {
    Col
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
        width: "70%",
        maxWidth: 200,
    },
    changeLoginButton: {
        marginTop: 10,
        marginBottom: 10,
        width: "70%",
        maxWidth: 200,
    },
    logo: {
        display: "block",
        margin: "auto",
        height: 150,
    }
};

var AuthSignInEmail = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired,
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            floatingUserText: "",
            floatingPassText: "",
            disableBtn: false,
        };
    },

    render() {
        const messages = this.context.intl.messages.signIn;
        const logo = (
            <Link to="/"><img style={styles.logo} src="/img/logo.png"/></Link>
        );

        return (<Col sm={6} smOffset={3} md={4} mdOffset={4} xs={12}>
                <Paper style={styles.paper} zDepth={1}>
                    <form >

                        {logo}

                        <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
                        <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

                        <TextField
                            ref="email"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingUserText}
                            hintText={messages["email-邮箱"]}
                            onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                        />
                        <br/>
                        <TextField
                            ref="password"
                            type="password"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingPassText}
                            hintText={messages["password-密码"]}
                            onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                        />
                        {/*<Link style={{display:"block", marginTop:"10px"}} to="/reset">
                            {messages["forgotpwd-忘记密码"]}
                        </Link>*/}
                    </form>

                    <RaisedButton label={messages["signIn-登录"]}
                                  onClick={this.handleSubmit}
                                  style={styles.registerButton}
                                  secondary={true}
                                  disabled={this.state.disableBtn}/>
                    <p>{messages["noAccount-还没帐号"]}
                        <Link to="/join">{messages["signUp_low-注册"]}</Link>
                    </p>

                    <p>{messages["or-或者"]}</p>

                    <RaisedButton label={messages["useMobile-手机登陆"]}
                                  onClick={this.handleSwitchToMobile}
                                  style={styles.changeLoginButton}
                                  primary={true}>
                    </RaisedButton>
                </Paper>
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let email = this.refs.email.getValue();
        if (!email) {
            this.setState({floatingUserText: messages["emailEmpty-邮箱能不为空"]});
        }
        else if (!validateEmail(email)) {
            this.setState({floatingUserText: messages["emailFormatError-邮箱错误"]});
        }
        else {
            this.setState({floatingUserText: ""});
            return true;
        }
        return false;
        function validateEmail(email) {//检查邮箱格式
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
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
        let email = this.refs.email.getValue();
        let password = this.refs.password.getValue();

        if (email && password && noInputError) {
            this.setState({disableBtn: true});
            Meteor.loginWithPassword(email, password, (error) => {
                if (error) {
                    this.setState({disableBtn: false, floatingPassText: error.error + " " + error.reason});
                    //console.log("error: ", error);
                    return;
                }
                Actions.setPassword(password);
                this.context.router.push('/list');
            });
        }
    },

    handleSwitchToMobile(){
        this.context.router.push('/loginMobile');
    },
});

module.exports = AuthSignInEmail;