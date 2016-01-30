const Link = ReactRouter.Link;

const {
    Paper,
    FlatButton,
    TextField,
    RaisedButton,
    Snackbar
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

AuthForgotPwdPage = React.createClass({
    getInitialState() {
        return {
            floatingUserText: "",
            snackBarOpen: false,
        };
    },

    render() {
        const logo = (
            <img style={style.logo} src="/img/logo.svg"/>
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
                        {/*Todo 加入验证码*/}
                    </form>

                    <RaisedButton label="找回密码"
                                  onClick={this.handleSubmit}
                                  style={style.registerButton}
                                  secondary={true}/>
                    <Snackbar
                        open={this.state.snackBarOpen}
                        message="密码找回邮件已经发到你的邮箱,请查收"
                        autoHideDuration={4000}
                        onRequestClose={this.handleRequestClose}
                    />
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


    handleSubmit(){
        /* Error check */
        this.handleInputErrorCheckUser();

        /* Save data & Handle login */
        let email = this.refs.email.getValue();

        Accounts.forgotPassword({email: email}, (error) => {
            if (error) {
                this.setState({floatingUserText: error.error + " " + error.reason});
                console.log("error: ", error);
                //alert("error: " + error);
                return;
            }
            this.setState({snackBarOpen: true});
        });
    },

    handleRequestClose(){
        this.setState({
            snackBarOpen: false,
        });
    },
});
