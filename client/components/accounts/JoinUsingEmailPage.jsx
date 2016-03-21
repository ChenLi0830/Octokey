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
    RaisedButton
    } = MUI;

const {
    Col
    } = ReactBootstrap;

const style = {
    paper: {
        paddingTop: 30,
        paddingBottom: 50,
        textAlign: 'center',
        backgroundColor:ZenColor.grey1,
    },
    registerButton: {
        marginTop: 25,
        marginBottom: 10,
        width: "70%",
    },
    logo: {
        display: "block",
        margin: "auto",
        height: 150,
    }
};

var JoinUsingEmailPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired,
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            floatingUserText: "",
            floatingPassText: "",
            disableBtn:false,
        };
    },

    render() {
        const {messages} = this.context.intl;

        const logo = (
            <Link to="/"><img style={style.logo} src="/img/logo.png"/></Link>
        );

        return (<Col sm={6} smOffset={3} md={4} mdOffset={4} xs={12}>
                <Paper style={style.paper} zDepth={1}>
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
                    </form>

                    <RaisedButton label={messages.login_signUp}
                                  onClick={this.handleSubmit}
                                  style={style.registerButton}
                                  secondary={true}
                                  disabled={this.state.disableBtn}/>
                    <p>{messages.login_haveAccount}<Link to="/login">{messages.login_signIn_low}</Link></p>
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
            Accounts.createUser({
                email: email,
                password: password
            }, (error) => {
                if (error) {
                    this.setState({disableBtn: false, floatingPassText: error.error + " " + error.reason});
                    console.log("error: ", error);
                    //alert("error: " + error);
                    return;
                }
                Meteor.call("initiateUser", function(){
                    Actions.setPassword(password);
                    this.context.router.push('/list');
                }.bind(this));
            });
        }
    }
});

module.exports = JoinUsingEmailPage;