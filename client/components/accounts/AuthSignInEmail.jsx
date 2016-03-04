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
    logo: {
        display: "block",
        margin: "auto",
        height: 150,
    }
};

AuthSignInEmail = React.createClass({
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

                        <TextField
                            ref="email"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingUserText}
                            hintText={messages.login_email}
                            onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                        />
                        <br/>
                        <TextField
                            ref="password"
                            type="password"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingPassText}
                            hintText={messages.login_password}
                            onKeyPress={(e)=>{e.key === 'Enter' && this.handleSubmit()}}
                        />
                        <Link style={{display:"block", marginTop:"10px"}} to="/reset">
                            {messages.login_forgotpwd}
                        </Link>
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

                    <RaisedButton label={/*messages.login_signIn*/"使用手机号登录"}
                                  onClick={this.handleSwitchToMobile}
                                  style={styles.registerButton}
                                  primary={true}>
                    </RaisedButton>
                </Paper>
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let email = this.refs.email.getValue();
        if (!email) {
            this.setState({floatingUserText: this.context.intl.messages.login_emailEmpty});
        }
        else if (!validateEmail(email)) {
            this.setState({floatingUserText: this.context.intl.messages.login_emailFormatError});
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
