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

const style = {
    paper: {
        padding: "30px 30px 50px 30px",
        //paddingTop: 30,
        //paddingBottom: 50,
        textAlign: 'center',
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
    }
};

AuthSignInPage = React.createClass({

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
                            floatingLabelText="邮箱"/>
                        <br/>
                        <TextField
                            ref="password"
                            type="password"
                            style={{fontWeight:"300"}}
                            floatingLabelStyle={{fontWeight:"300"}}
                            errorText={this.state.floatingPassText}
                            onBlur={this.handleInputErrorCheckPass}
                            floatingLabelText="密码"/>
                        <Link style={{display:"block", marginTop:"10px"}} to="/reset">忘记密码?</Link>
                    </form>

                    <RaisedButton label="登录"
                                  onClick={this.handleSubmit}
                                  style={style.registerButton}
                                  secondary={true}/>
                    <p>还没有帐号? 快去<Link to="/signUp">注册</Link></p>
                </Paper>
            </Col>
        );
    },

    handleInputErrorCheckUser(){
        let email = this.refs.email.getValue();
        if (!email) {
            this.setState({floatingUserText: "邮箱不能为空"});
        }
        else if (!validateEmail(email)) {
            this.setState({floatingUserText: "邮箱格式有误, 请检查"});
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
            this.setState({floatingPassText: "密码不能为空"});
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

        Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
                this.setState({floatingPassText: error.error + " " + error.reason});
                console.log("error: ", error);
                //alert("error: " + error);
                return;
            }

            this.props.history.pushState(null, '/list');
        });
    },

});
