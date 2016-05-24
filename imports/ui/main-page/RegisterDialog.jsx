/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-2-13
 *
 * Dialog component for app-registration progress bar, called by "AppsContainer"
 *******************************************************************************/
import React from "react";
var CaptchaDialog = require('./CaptchaDialog.jsx');

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import LinearProgress from "material-ui/LinearProgress";

import {FormattedMessage} from "react-intl";

let username;

var RegisterDialog = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    registerRequest: React.PropTypes.object.isRequired,
    openDialogRegister: React.PropTypes.bool.isRequired,
    whenLogin: React.PropTypes.func.isRequired,
    whenCloseDialog: React.PropTypes.func.isRequired,
    registerLink: React.PropTypes.string,
    //whenSubmitCredential: React.PropTypes.func.isRequired,
    //hexIv: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      floatingUserText: "",
      floatingPassText: "",
      userNameFilled: false,
      passwordFilled: false,
      openDialogCaptcha: !!this.props.registerRequest.require,
    }
  },

  componentWillMount(){
    username = "";
  },

  render(){
    const messages = this.context.intl.messages.register;
    const {registerRequest} = this.props;
    let actions = [
      <FlatButton
          label={registerRequest.progress !== 100 ? messages["cancel-取消"]:messages["ok-完成"]}
          primary={true}
          onTouchTap={this.props.whenCloseDialog}/>,
      registerRequest.progress === 100 ?
          <FlatButton
              primary={ true }
              label={messages["login-去登录"]}
              onTouchTap={()=>{this.props.whenLogin();this.props.whenCloseDialog();}}
          /> : null,
      registerRequest.progress === -100 ?
          <FlatButton
              primary={ true }
              label={messages["manual-sign-up-亲自注册"]}
              onTouchTap={this.handleRegisterManually}
          /> : null
    ];

    //console.log("registerRequest", registerRequest);
    return <Dialog
        title={this.props.appName + "-" + messages["auto-sign-up-自动注册"]}
        actions={actions}
        modal={true}
        open={this.props.openDialogRegister}
        onRequestClose={this.props.whenCloseDialog}>

      <LinearProgress mode="determinate" value={registerRequest.progress}/>
      <p>
        {messages[registerRequest.message]}
      </p>

      {registerRequest.require ?
          <CaptchaDialog
              requiredInput={registerRequest.require}
              openDialogRegister={this.state.openDialogCaptcha}
              whenCloseDialog={()=>{this.setState({openDialogCaptcha:false})}}
          /> : null}
    </Dialog>
  },

  handleRegisterManually(){
    if (this.props.registerLink) {
      window.open(this.props.registerLink, "_blank");
    } else {
      throw new Meteor.Error("no registerLink for this app");
    }
  },
});

module.exports = RegisterDialog;