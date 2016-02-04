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
    },

    contextTypes:{
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
                    floatingLabelText={messages.app_username}/>
                <br/>
                <TextField
                    ref="password"
                    type="password"
                    style={{fontWeight:"300"}}
                    floatingLabelStyle={{fontWeight:"300"}}
                    errorText={this.state.floatingPassText}
                    onChange={this.handleInputErrorCheckPass}
                    floatingLabelText={messages.app_password}/>
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

            if (this.props.isPublicApp) {
                Meteor.call("addNewCredential", this.props.appId, username, password, function (error) {
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
    },
});