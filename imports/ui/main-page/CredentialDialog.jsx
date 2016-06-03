/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Dialog component for user input app credential, called by "UserAppsContainer"
 *******************************************************************************/
import React from "react"
import {FormattedMessage} from "react-intl";
import _ from "lodash";

import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import Tooltip from "antd/lib/tooltip";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Checkbox from "antd/lib/checkbox";

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
  inlineCol: {
    display: "inline-block",
    float: "none",
  },
  inlineColTitle: {
    textAlign: "center",
    lineHeight: "50px",
  },
  verticalDivider: {
    borderLeft: "thin solid #E9E9E9",
  }
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
    whenVisitHomePage: React.PropTypes.func.isRequired,
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
    messages = this.context.intl.messages.credentialDialog;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
      required: true,
      hasFeedback: true,
    };

    const loginForms = (
        <Row type="flex" align="middle">
          <Col span="9" style={styles.inlineCol}>
            <h3 style={styles.inlineColTitle}>{messages["直接访问"]}</h3>
            <Form horizontal form={this.props.form}>

              <FormItem style={{ marginTop: 24, textAlign:"center" }}>
                <Button htmlType="submit" onClick={this.handleVisitHomePage}>{messages["去主页"]}</Button>
              </FormItem>

              {/*<FormItem >
                <Checkbox defaultChecked={false}>以后不再询问</Checkbox>
              </FormItem>*/}
            </Form>
          </Col>

          <Col span="15" style={_.extend({}, styles.inlineCol, styles.verticalDivider)}>
            <h3 style={styles.inlineColTitle}>{messages["帐号登录访问"]}</h3>
            <Form horizontal form={this.props.form}>

              {/*This is here to stop chrome's username and password autofill*/}
              <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
              <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

              <FormItem
                  {...formItemLayout}
                  label={messages["用户名："]}
                  validateStatus={this.state.floatingUserError.length===0? "": "error"}
                  help={this.state.floatingUserError}>
                <Input ref="username"
                       placeholder={messages["请输入账户名"]}
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur1}
                       onChange={this.handleInputErrorCheckUser}
                />
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={messages["密码："]}
                  validateStatus={this.state.floatingPassError.length===0? "": "error"}
                  help={this.state.floatingPassError}>
                <Input type="password"
                       ref="password"
                       placeholder={messages["请输入密码"]}
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur1}
                       onChange={this.handleInputErrorCheckPass}
                />
              </FormItem>
            </Form>
          </Col>
        </Row>
    );

    const verifyForm = (<Form horizontal form={this.props.form}>
      <p>{messages.verifyMessage}</p>
    </Form>);

    return <div>
      <Modal
          onOk={this.state.openVerify ? this.handleCloseDialog: this.handleSubmit}
          onCancel={this.state.openVerify ? this.verifyUnsuccess : this.handleCloseDialog}
          okText={this.state.openVerify ? messages.verifyBtn_success: messages["登录"]}
          cancelText={this.state.openVerify ? messages.verifyBtn_fail: messages["取消"]}
          title={this.getTitle()}
          visible={this.props.openDialogCredential}>

        {this.state.openVerify ? verifyForm : loginForms}
      </Modal>

    </div>
  },

  getTitle(){
    const verifyTitle = this.props.appName +
        this.context.intl.messages.verifyTitle;

    const logo = this.props.logoURL === "" ?
        <div style={styles.noLogoBox}>
          <div style={styles.noLogoText}>{this.props.appName[0]}</div>
        </div> :
        <img style={styles.logo} src={OctoClientAPI.getLogoUrl(this.props.appId)}/>;

    const normalTitle = <div>
      {logo}
      {<FormattedMessage id="app_credentialDialogMessage" values={{appName:this.props.appName}}/>}
      <Tooltip title={<ul><li>{messages["国际领先加密算法AES256, 保证安全无虞"]}</li></ul>}>
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

        this.openVerifyDialog();
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

  openVerifyDialog(){
    this.setState({openVerify: true});
  },

  verifyUnsuccess(){//login unsuccessful, reset username and password
    OctoClientAPI.removeCredential(this.props.appId, savedUsername);
    this.setState({openVerify: false});
  },

  handleVisitHomePage(){
    this.handleCloseDialog();
    this.props.whenVisitHomePage();
  },

});

module.exports = CredentialDialog;