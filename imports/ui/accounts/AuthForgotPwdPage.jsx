/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-2
 *
 * Forgot password page component, called by AuthSignInPage component
 *******************************************************************************/
import React from "react";

import {Link} from "react-router";

import {
    Paper,
    TextField,
    RaisedButton,
    Snackbar
    } from "material-ui";

import{Col} from "antd";

import {FormattedMessage} from "react-intl";

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

var AuthForgotPwdPage = React.createClass({
  getInitialState() {
    return {
      floatingUserText: "",
      snackBarOpen: false,
    };
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  render() {
    const {messages} = this.context.intl;
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
                  hintText={messages.login_email}/>
              <br/>
              {/*Todo 加入验证码*/}
            </form>

            <RaisedButton label={messages.login_resetPwd}
                          onClick={this.handleSubmit}
                          style={style.registerButton}
                          primary={ true }/>
            <Snackbar
                open={this.state.snackBarOpen}
                message={<FormattedMessage id="login_emailNotif"
                            values={{email:this.refs.email?this.refs.email.getValue():null}}/>}
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
      this.setState({floatingUserText: this.context.intl.messages.login_emailEmpty});
    }
    else if (!OctoClientAPI.isValidateEmail(email)) {
      this.setState({floatingUserText: this.context.intl.messages.login_emailFormatError});
    }
    else {
      this.setState({floatingUserText: ""});
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

module.exports = AuthForgotPwdPage;