/*******************************************************************************
 * Copyright (C) 2015 Octokey Inc.
 *
 * Creator: Chen Li<chen.li@oyaoshi.com>
 * Creation Date: 2015-2-2
 *
 * Sign-up Step 2, called by "JoinPage"
 *******************************************************************************/

const {
    RaisedButton,
    } = MUI;

const {
    Col,
    } = ReactBootstrap;

import {
    Button,
    Steps,
    Form,
    Input,
    Popover
} from 'antd';
const FormItem = Form.Item;

const styles = {
  contentCol: {
    float: "none",
    marginTop: 50,
    textAlign: "center",
  },
  primaryText: {
    color: ZenColor.cyan,
    fontWeight: "300"
  },
  secondaryText: {
    color: ZenColor.grey3,
    fontWeight: 100,
  },
  registerButton: {
    marginTop: 25,
    //marginBottom: 10,
    width: "70%",
    maxWidth: 200,
  },
};

//Used in callback 'onStepComplete'
let isUsingEmail = true;

var JoinStep2Mobile = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  propTypes: {
    onStepComplete: React.PropTypes.func.isRequired,
    finalMobile: React.PropTypes.string.isRequired,
    finalCaptcha: React.PropTypes.string.isRequired,
  },

  getInitialState(){
    return {
      pwdVerified: false,
      twoPwdSame: false,
      errorText: "",
      errorText2: "",
      registerBtnDisable: false,
    }
  },


  render(){
    //messages = _.extend({}, this.context.intl.messages.join, this.context.intl.messages.signIn);
    return (
        <Col sm={8} smOffset={2} md={6} mdOffset={3} xs={12} style={styles.contentCol}>
          <div>
            <h1 style={styles.primaryText}>
              {messages["setMasterPWD-设置核心密码"]}
            </h1>
          </div>
          <div>
            <h2 style={_.extend({}, styles.secondaryText, {marginTop: 30})}>
              {messages["msg-唯一要记的密码"]}
            </h2>
            <h4 style={styles.secondaryText}>
              {messages["msg-核心密码无法取回"]}
            </h4>
          </div>
          <br/>
          <Form horizontal>
            <input style={{display: "none"}} type="text"
                   name="fakeusernameremembered"/>
            <input style={{display: "none"}} type="password"
                   name="fakepasswordremembered"/>

            <FormItem
                label={messages["masterPWD-核心密码"]}
                hasFeedback={true}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                validateStatus={this.state.errorText!==""?"error": this.state.pwdVerified ? "success" : ""}
                help={this.state.errorText}>
              <Popover placement="right" title={messages["pwdRequirement-密码要求"]}
                       overlay={<div>{messages["pwdLength-密码长度"]}<br />{messages["pwdFormat-密码格式"]}</div>}
                       trigger="focus">

                <Input type="password"
                       ref="password"
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur1}
                       onChange={this.handleInputPassword}
                />
              </Popover>
            </FormItem>


            <FormItem
                label={messages["inputPWDAgain-再次输入"]}
                hasFeedback={true}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                validateStatus={this.state.errorText2!==""? "error": this.state.twoPwdSame ? "success" : ""}
                help={this.state.errorText2}>
              <Popover placement="right" title={messages["pwdRequirement-密码要求"]}
                       overlay={messages["pwdConfirmPopover-pop再次输入"]}
                       trigger="focus">
                <Input type="password"
                       ref="password2"
                       autoComplete="off"
                       onContextMenu={false} onPaste={false} onCopy={false} onCut={false}
                       onBlur={this.pwdOnBlur2}
                       onChange={this.handleInputPassword2}
                />
              </Popover>
            </FormItem>

          </Form>

          <RaisedButton label={messages["ok-确认"]}
                        onClick={this.handleRegister}
                        style={styles.registerButton}
                        secondary={true}
                        disabled={this.state.registerBtnDisable}
          />

          {/*Todo add captcha*/}

          <br/>

        </Col>
    )
  },

  handleInputPassword(){
    const pwd = this.refs.password.refs.input.value;
    //console.log("pwd",pwd);
    //Check password
    if (OctoAPI.checkPassword(pwd)) {
      this.setState({pwdVerified: true, errorText: ""});
      return true;
    } else {
      this.setState({pwdVerified: false});
      return false;
    }
  },

  handleInputPassword2(){
    const pwd = this.refs.password.refs.input.value;
    const pwd2 = this.refs.password2.refs.input.value;
    if (pwd === pwd2) {
      this.setState({twoPwdSame: true, errorText2: ""});
      return true;
    } else {
      this.setState({twoPwdSame: false});
      return false;
    }
  },

  pwdOnBlur1(){
    if (this.state.pwdVerified) {
      this.setState({showPopOver: false, errorText: "" /*message*/})
    } else {
      this.setState({showPopOver: false, errorText: messages["pwdFormatError-密码格式有误"]})
    }
  },

  pwdOnBlur2(){
    if (this.state.twoPwdSame) {
      this.setState({showPopOver2: false, errorText2: ""})
    } else {
      this.setState({showPopOver2: false, errorText2: messages["pwdNotMatch-两次密码不一致"]})
    }
  },

  handleRegister(){
    //if no errors, go to step 3, create account
    const noError = this.handleInputPassword() && this.handleInputPassword2();

    if (noError) {
      const {finalMobile,finalCaptcha} = this.props;
      const finalPwd = this.refs.password.refs.input.value;

      if (finalMobile && finalCaptcha && finalPwd) {
        this.setState({errorText: ""});
        Meteor.call("setMobilePassword", finalMobile, finalCaptcha, finalPwd, function (error) {
          if (error) {
            console.log("error");
            this.setState({errorText: error.reason});
          }
          this.props.onStepComplete(finalPwd);
        }.bind(this));
      }
      Actions.setPassword(finalPwd);
    }
    else {
      if (this.state.errorText === "" && this.state.errorText2 === "") {
        this.setState({errorText: messages["unknownError-两次输入的密码有误"]})
      }
    }
  },

});


module.exports = JoinStep2Mobile;