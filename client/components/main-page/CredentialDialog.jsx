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

CredentialDialog = React.createClass({
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
            floatingUserText: "",
            floatingPassText: "",
            userNameFilled: false,
            passwordFilled: false,
        }
    },

    render(){
        const {messages} = this.context.intl;
        const actions = [
            <FlatButton
                label={messages.app_credentialDialogCancel}
                primary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
            <FlatButton
                secondary={true}
                label={messages.app_credentialDialogLogin}
                onTouchTap={this.handleSubmit}/>
        ];

        //let title;
        //<FormattedMessage id="app_credentialDialogMessage" values={{appName: this.props.appName}}>
        //    {function(formattedValue){title = formattedValue}}
        //</FormattedMessage>
        return <Dialog
            title={this.props.appName + "-" + messages.app_credentialDialogMessage}
            actions={actions}
            modal={false}
            open={this.props.openDialogCredential}
            onRequestClose={this.props.whenCloseDialog}>

            {/*This is here to stop chrome's username and password autofill*/}
            <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
            <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

            <TextField
                ref="username"
                style={{fontWeight:"300"}}
                floatingLabelStyle={{fontWeight:"300"}}
                errorText={this.state.floatingUserText}
                onChange={this.handleInputErrorCheckUser}
                onKeyPress={(e)=>{e.key==='Enter' && this.handleSubmit()}}
                hintText={messages.app_username}/>
            <br/>
            <TextField
                ref="password"
                type="password"
                style={{fontWeight:"300"}}
                floatingLabelStyle={{fontWeight:"300"}}
                errorText={this.state.floatingPassText}
                onChange={this.handleInputErrorCheckPass}
                onKeyPress={(e)=>{e.key==='Enter' && this.handleSubmit()}}
                hintText={messages.app_password}/>
        </Dialog>
    },

    handleSubmit(){
        /* Error check */
        this.handleInputErrorCheckUser();
        this.handleInputErrorCheckPass();

        /* Save data & Handle login */
        let username = this.refs.username.getValue();
        let password = this.refs.password.getValue();

        if (username && password) {
            if (saveCredential(this.props.appId, this.props.hexIv, username, password, this.props.isPublicApp)){//If
                // it's successful
                this.props.whenSubmitCredential(username, password);
                this.props.whenCloseDialog();
            }
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
    },
});