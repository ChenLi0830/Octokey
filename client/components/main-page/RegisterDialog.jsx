/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-13
 *
 * Dialog component for app-registration progress bar, called by "AppsContainer"
 *******************************************************************************/
var CaptchaDialog = require('./CaptchaDialog.jsx');

const {
    Dialog,
    FlatButton,
    TextField,
    LinearProgress
    } = MUI;

const {FormattedMessage} = ReactIntl;

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
        const {messages} = this.context.intl;
        const {registerRequest} = this.props;
        let actions = [
            <FlatButton
                label={registerRequest.progress !== 100 ?"取消":"完成"/*messages.app_credentialDialogCancel*/}
                primary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
            registerRequest.progress === 100 ?
                <FlatButton
                    secondary={true}
                    label={"去登录"/*messages.app_credentialDialogLogin*/}
                    onTouchTap={()=>{this.props.whenLogin();this.props.whenCloseDialog();}}
                /> : null,
            registerRequest.progress === -100 ?
                <FlatButton
                    secondary={true}
                    label={"亲自去注册"/*messages.app_credentialDialogLogin*/}
                    onTouchTap={this.handleRegisterManually}
                /> : null
        ];

        //console.log("registerRequest", registerRequest);
        return <Dialog
            title={this.props.appName + "-" + "自动注册"/*messages.app_registerDialogMessage*/}
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


    /*    handleSubmit(){
     /!* Error check *!/
     this.handleInputErrorCheckUser();
     this.handleInputErrorCheckPass();

     /!* Save data & Handle login *!/
     let username = this.refs.username.getValue();
     let password = this.refs.password.getValue();

     if (username && password) {
     let hexKey = Session.get("hexKey");
     if (!hexKey) throw Meteor.Error("Can't find master password key");
     let encryptedPwd = encrypt(password, hexKey, this.props.hexIv);
     if (this.props.isPublicApp) {
     Meteor.call("addNewCredential", this.props.appId, username, encryptedPwd, function (error) {
     if (error) {
     throw new Meteor.Error("Error adding new Credential");
     }
     }.bind(this));

     Meteor.call("appAddUsername", this.props.appId, username, function (error) {
     if (error) {
     throw new Meteor.Error("Error adding new Credential");
     }
     }.bind(this));
     this.props.whenSubmitCredential(username, password);
     this.props.whenCloseDialog();
     } else {
     alert("TODO: adding credentials for the private app");
     }

     //TODO 询问用户是否登录成功,如果否,删除用户登录信息,保留textFields, 如果是,关闭modal.
     }
     },

     handleInputErrorCheckUser(){
     let userName = this.refs.username.getValue();
     if (!userName) {
     this.setState({floatingUserText: this.context.intl.messages.login_usernameEmpty});
     } else {
     this.setState({floatingUserText: ""});
     }
     },

     handleInputErrorCheckPass(){
     let password = this.refs.password.getValue();
     if (!password) {
     this.setState({floatingPassText: this.context.intl.messages.login_pwdEmpty});
     } else {
     this.setState({floatingPassText: ""});
     }
     },*/
});

module.exports = RegisterDialog;