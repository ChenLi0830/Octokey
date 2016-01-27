const {
    Dialog,
    FlatButton,
    TextField
    } = MUI;

CredentialDialog = React.createClass({
    propTypes: {
        appName: React.PropTypes.string.isRequired,
        appId: React.PropTypes.string.isRequired,
        isPublicApp: React.PropTypes.bool.isRequired,
        openDialogCredential: React.PropTypes.bool.isRequired,
        whenCloseDialog: React.PropTypes.func.isRequired,
        whenSubmitCredential: React.PropTypes.func.isRequired,
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
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
            <FlatButton
                secondary={true}
                label="去登录"
                onTouchTap={this.handleSubmit}/>
        ];

        return <Dialog
            title={"请输入你在"+"\""+this.props.appName+"\"的登录信息 (只需输入一次)"}
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
                floatingLabelText="用户名"/>
            <br/>
            <TextField
                ref="password"
                type="password"
                style={{fontWeight:"300"}}
                floatingLabelStyle={{fontWeight:"300"}}
                errorText={this.state.floatingPassText}
                onChange={this.handleInputErrorCheckPass}
                floatingLabelText="密码"/>
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
                    this.props.whenSubmitCredential(CredentialDialog);
                }.bind(this));

                Meteor.call("appAddUsername", this.props.appId, username, function (error) {
                    if (error) {
                        throw new Meteor.Error("Error adding new Credential");
                    }
                    this.props.whenCloseDialog();
                }.bind(this));
            } else {
                alert("TODO: adding credentials for the private app");
            }

            //TODO 询问用户是否登录成功,如果否,删除用户登录信息,保留textFields, 如果是,关闭modal.
        }
    },

    handleInputErrorCheckUser(){
        let userName = this.refs.username.getValue();
        if (!userName) {
            this.setState({floatingUserText: "用户名不能为空"});
        } else {
            this.setState({floatingUserText: ""});
        }
    },

    handleInputErrorCheckPass(){
        let password = this.refs.password.getValue();
        if (!password) {
            this.setState({floatingPassText: "密码不能为空"});
        } else {
            this.setState({floatingPassText: ""});
        }
    },
});