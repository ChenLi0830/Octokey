/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-13
 *
 * Dialog component for app-registration progress bar, called by "AppsContainer"
 *******************************************************************************/
const {
    Dialog,
    FlatButton,
    TextField,
    LinearProgress
    } = MUI;

const {FormattedMessage} = ReactIntl;

RegisterDialog = React.createClass({
    propTypes: {
        appName: React.PropTypes.string.isRequired,
        appId: React.PropTypes.string.isRequired,
        registerProgress: React.PropTypes.number.isRequired,
        registerMessage: React.PropTypes.string.isRequired,
        openDialogRegister: React.PropTypes.bool.isRequired,
        whenCloseDialog: React.PropTypes.func.isRequired,
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
        }
    },

    render(){
        const {messages} = this.context.intl;
        let actions = [
            <FlatButton
                label={this.props.registerProgress !== 100 ?"取消":"完成"/*messages.app_credentialDialogCancel*/}
                primary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
            this.props.registerProgress === 100 ?
                <FlatButton
                    secondary={true}
                    label={"去登录"/*messages.app_credentialDialogLogin*/}
                    onTouchTap={this.handleSubmit}
                /> : null,
            this.props.registerProgress === -100 ?
            <FlatButton
                linkButton={true}
                href="https://github.com/callemall/material-ui"
                secondary={true}
                label={"亲自去注册"/*messages.app_credentialDialogLogin*/}
                onTouchTap={this.handleSubmit}
            />: null
        ];
        actions = _.remove(actions,null);//remove empty button

        console.log("actions", actions);
        return <Dialog
            title={this.props.appName + "-" + "自动注册"/*messages.app_registerDialogMessage*/}
            actions={actions}
            modal={true}
            open={this.props.openDialogRegister}
            onRequestClose={this.props.whenCloseDialog}>

            <LinearProgress mode="determinate" value={this.props.registerProgress}/>
            <p>
                {this.props.registerMessage}
            </p>
        </Dialog>
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