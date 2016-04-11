/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Dialog component for user input app credential, called by "AppsContainer"
 *******************************************************************************/
const {
    Dialog,
    FlatButton,
    TextField
    } = MUI;

const {FormattedMessage} = ReactIntl;

let savedUsername = "";

var CredentialDialog = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    isPublicApp: React.PropTypes.bool.isRequired,
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
      openVerify: false,
    }
  },

  render(){
    const {messages} = this.context.intl;
    const actions = [
      <FlatButton
          label={messages.app_credentialDialogCancel}
          primary={true}
          onTouchTap={this.handleCloseDialog}/>,
      <FlatButton
          secondary={true}
          label={messages.app_credentialDialogLogin}
          onTouchTap={this.handleSubmit}/>
    ];

    //The buttons of verify page
    const verifyActions = [
      <FlatButton
          label={messages.credentialDialog.verifyBtn_fail}
          primary={true}
          onTouchTap={this.verifyUnsuccess}/>,
      <FlatButton
          secondary={true}
          label={messages.credentialDialog.verifyBtn_success}
          onTouchTap={this.handleCloseDialog}/>
    ];

    const loginForms = (
        <div>
          {/*This is here to stop chrome's username and password autofill*/}
          <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
          <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

          <TextField
              ref="username"
              style={{fontWeight:"300"}}
              floatingLabelStyle={{fontWeight:"300"}}
              errorText={this.state.floatingUserError}
              onChange={this.handleInputErrorCheckUser}
              onKeyPress={(e)=>{e.key==='Enter' && this.handleSubmit()}}
              hintText={messages.app_username}
              defaultValue={savedUsername}
          />
          <br/>
          <TextField
              ref="password"
              type="password"
              style={{fontWeight:"300"}}
              floatingLabelStyle={{fontWeight:"300"}}
              errorText={this.state.floatingPassError}
              onChange={this.handleInputErrorCheckPass}
              onKeyPress={(e)=>{e.key==='Enter' && this.handleSubmit()}}
              hintText={messages.app_password}/>
        </div>
    );

    const verifyText = (<div>
      <p>{messages.credentialDialog.verifyMessage}</p>
    </div>);

    return <div>
      <Dialog
          title={this.getTitle()}
          actions={this.state.openVerify ? verifyActions:actions}
          modal={false}
          open={this.props.openDialogCredential}
          onRequestClose={this.handleCloseDialog}
          children={this.state.openVerify ? verifyText : loginForms}
      />
    </div>
  },

  getTitle(){
    const verifyTitle = this.props.appName +
        this.context.intl.messages.credentialDialog.verifyTitle;
    const normalTitle = this.props.appName + "-" +
        this.context.intl.messages.app_credentialDialogMessage;
    return this.state.openVerify ? verifyTitle : normalTitle;
  },

  handleSubmit(){
    /* Error check */
    this.handleInputErrorCheckUser();
    this.handleInputErrorCheckPass();

    /* Save data & Handle login */
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();

    if (username && password) {
      if (OctoClientAPI.saveCredential(this.props.appId, this.props.hexIv, username, password,
              this.props.isPublicApp)) {//If
        // it's successful
        this.props.whenSubmitCredential(username, password);
        savedUsername = username;

        this.verifyCredential();
        //this.props.whenCloseDialog();
      }
    }
  },

  handleInputErrorCheckUser(){
    let userName = this.refs.username.getValue();
    if (!userName) {
      this.setState({floatingUserError: this.context.intl.messages.login_usernameEmpty});
    } else {
      this.setState({floatingUserError: ""});
    }
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.getValue();
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