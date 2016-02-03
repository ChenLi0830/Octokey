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

const {FormattedMessage} = ReactIntl;

const style = {
    paper: {
        paddingTop: 30,
        paddingBottom: 50,
        textAlign: 'center',
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


AuthJoinPage = React.createClass({
    getInitialState() {
        return {
            floatingUserText: "",
            floatingPassText: "",
        };
    },

    render() {
        const logo = (
            <Link to="/"><img style={style.logo} src="/img/logo.svg"/></Link>
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
                            onBlur={this.handleInputErrorCheckUser}
                            floatingLabelText={<FormattedMessage id="login_email"/>}/>
                        <br/>
                        <TextField
                            ref="password"
                            type="password"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingPassText}
                            onBlur={this.handleInputErrorCheckPass}
                            floatingLabelText={<FormattedMessage id="login_password"/>}/>
                    </form>

                    <RaisedButton label={<FormattedMessage id="login_signUp"/>}
                                  onClick={this.handleSubmit}
                                  style={style.registerButton}
                                  secondary={true}/>
                    <p><FormattedMessage id="login_haveAccount"/><Link to="/login"><FormattedMessage id="login_signIn_low"/></Link></p>
                </Paper>
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let email = this.refs.email.getValue();
        if (!email) {
            this.setState({floatingUserText: <FormattedMessage id="login_emailEmpty"/>});
        }
        else if (!validateEmail(email)) {
            this.setState({floatingUserText: <FormattedMessage id="login_emailFormatError"/>});
        }
        else {
            this.setState({floatingUserText: ""});
        }

        function validateEmail(email) {//检查邮箱格式
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    },

    handleInputErrorCheckPass(){
        let password = this.refs.password.getValue();
        if (!password) {
            this.setState({floatingPassText: <FormattedMessage id="login_pwdEmpty"/>});
        } else {
            this.setState({floatingPassText: ""});
        }
    },

    handleSubmit(){
        /* Error check */
        this.handleInputErrorCheckUser();
        this.handleInputErrorCheckPass();

        /* Save data & Handle login */
        let email = this.refs.email.getValue();
        let password = this.refs.password.getValue();

        if (email && password && this.state.floatingUserText.length === 0 && this.state.floatingPassText.length === 0) {
            Accounts.createUser({
                email: email,
                password: password
            }, (error) => {
                if (error) {
                    this.setState({floatingPassText: error.error+" "+error.reason});
                    console.log("error: " , error);
                    //alert("error: " + error);
                    return;
                }
                this.props.history.pushState(null, '/list');
            });
        }
    }

});
