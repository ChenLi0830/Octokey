/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Dialog component for user input app credential, called by "AppsContainer"
 *******************************************************************************/ import React from "react"
import {FormattedMessage} from "react-intl";

import { Button, Form, Input, Modal, Tooltip, Icon } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let savedUsername = "";
const styles = {
  logo: {
    height: "18px",
    margin: "-2px 5px 0px 0px",
    borderRadius: "3px",
  },
  noLogoBox: {
    display: "inline-block",
    height: "20px",
    width: "20px",
    margin: "0px 5px 0px 0px",
    borderRadius: "2px",
    backgroundColor: "#3399FF",
  },
  noLogoText: {
    textAlign: "center",
    color: "white",
    fontSize: "16px",
    fontWeight: "200",
  },
};

var CredentialDialog = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    isPublicApp: React.PropTypes.bool.isRequired,
    logoURL: React.PropTypes.string.isRequired,
    openDialogCredential: React.PropTypes.bool.isRequired,
    whenCloseDialog: React.PropTypes.func.isRequired,
    whenSubmitCredential: React.PropTypes.func.isRequired,
    hexIv: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      floatingUserError: "",
      floatingPassError: "",
      //dialog state for 刚刚登录是否成功?
      openVerify: false,
    }
  },

  render(){
    const {messages} = this.context.intl;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      required: true,
      hasFeedback: true,
    };

    const loginForms = (
        <div>
          {/*This is here to stop chrome's username and password autofill*/}
          <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
          <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

          <FormItem
              {...formItemLayout}
              label={"用户名："}
              validateStatus={this.state.floatingUserError.length===0? "": "error"}
              help={this.state.floatingUserError}>
            <Input ref="username"
                   placeholder="请输入账户名"
                   autoComplete="off"
                   onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                   onBlur={this.pwdOnBlur1}
                   onChange={this.handleInputErrorCheckUser}
            />
          </FormItem>
          <FormItem
              {...formItemLayout}
              label={"密码："}
              validateStatus={this.state.floatingPassError.length===0? "": "error"}
              help={this.state.floatingPassError}>
            <Input type="password"
                   ref="password"
                   placeholder="请输入密码"
                   autoComplete="off"
                   onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                   onBlur={this.pwdOnBlur1}
                   onChange={this.handleInputErrorCheckPass}
            />
          </FormItem>
        </div>
    );

    const verifyForm = (<div>
      <p>{messages.credentialDialog.verifyMessage}</p>
    </div>);

    return <div>
      <Modal
          onOk={this.state.openVerify ? this.handleCloseDialog: this.handleSubmit}
          onCancel={this.state.openVerify ? this.verifyUnsuccess : this.handleCloseDialog}
          okText={this.state.openVerify ? messages.credentialDialog.verifyBtn_success: "登录"}
          cancelText={this.state.openVerify ? messages.credentialDialog.verifyBtn_fail: "取消"}
          title={this.getTitle()}
          visible={this.props.openDialogCredential}>
        <Form horizontal form={this.props.form}>
          {this.state.openVerify ? verifyForm : loginForms}
        </Form>
      </Modal>

    </div>
  },

  getTitle(){
    const verifyTitle = this.props.appName +
        this.context.intl.messages.credentialDialog.verifyTitle;

    const logo = this.props.logoURL === "" ?
        <div style={styles.noLogoBox}>
          <div style={styles.noLogoText}>{this.props.appName[0]}</div>
        </div> :
        <img style={styles.logo} src={OctoClientAPI.getLogoUrl(this.props.appId)}/>;

    const normalTitle = <div>
      {logo}
      {<FormattedMessage id="app_credentialDialogMessage" values={{appName:this.props.appName}}/>}
      <Tooltip title={<ul><li>该登录信息会被放入您的登录保险箱</li><li>国际领先加密算法AES256, 保证安全无虞</li></ul>}>
        <Icon type="question-circle-o"/>
      </Tooltip>
    </div>;
    return this.state.openVerify ? verifyTitle : normalTitle;
  },

  handleSubmit(){
    /* Error check */
    this.handleInputErrorCheckUser();
    this.handleInputErrorCheckPass();

    /* Save data & Handle login */
    let username = this.refs.username.refs.input.value;
    let password = this.refs.password.refs.input.value;

    if (username && password) {
      if (OctoClientAPI.saveCredential(this.props.appId, this.props.hexIv, username, password,
              this.props.isPublicApp)) {//If user credential is saved to database successfully
        //Todo only encrypt pwd first and pass it into saveCredential,而不是encrypt两次
        const hexKey = Session.get("hexKey");
        const encryptedPwd = OctoClientAPI.encrypt(password, hexKey, this.props.hexIv);
        //console.log("encryptedPwd", encryptedPwd);

        this.props.whenSubmitCredential(username, password);
        savedUsername = username;

        this.verifyCredential();
        //this.props.whenCloseDialog();
      }
    }
  },

  handleInputErrorCheckUser(){
    //console.log("this.refs.username.refs.input.value", this.refs.username.refs.input.value);
    let userName = this.refs.username.refs.input.value;
    if (!userName) {
      this.setState({floatingUserError: this.context.intl.messages.login_usernameEmpty});
    } else {
      this.setState({floatingUserError: ""});
    }
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.refs.input.value;
    if (!password) {
      this.setState({floatingPassError: this.context.intl.messages.login_pwdEmpty});
    } else {
      this.setState({floatingPassError: ""});
    }
  },

  handleCloseDialog(){
    //Reset initial State
    this.setState({
      floatingUserError: "",
      floatingPassError: "",
      openVerify: false,
    });

    this.props.whenCloseDialog();
  },

  verifyCredential(){
    this.setState({openVerify: true});

  },

  verifyUnsuccess(){//login unsuccessful, reset username and password
    OctoClientAPI.removeCredential(this.props.appId, savedUsername);
    this.setState({openVerify: false});
  },
});

module.exports = CredentialDialog;