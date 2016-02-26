/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-2-13
 *
 * Dialog component for app-registration captcha, called by "RegisterDialog"
 *******************************************************************************/
const {
    Dialog,
    FlatButton,
    TextField,
    } = MUI;

const {FormattedMessage} = ReactIntl;

CaptchaDialog = React.createClass({
    propTypes: {
        requiredInput: React.PropTypes.string.isRequired,
        openDialogRegister: React.PropTypes.bool.isRequired,
        whenCloseDialog: React.PropTypes.func.isRequired,
        //hexIv: React.PropTypes.string.isRequired,
    },

    contextTypes: {
        intl: React.PropTypes.object.isRequired,
    },

    render(){
        const {messages} = this.context.intl;
        let actions = [
            <FlatButton
                label={"提交"/*messages.app_credentialDialogCancel*/}
                primary={true}
                onTouchTap={this.handleSubmit}/>,
        ];

        let title = "";
        switch (this.props.requiredInput) {
            case "mobileCaptcha":
                title = "验证码已发送到您的手机, 请填入"/*messages.app_username*/;
                break;
            default:
                title = "请填入信息"/*messages.app_username*/;
                break;
        }

        return <Dialog
            title={title/*messages.app_registerDialogMessage*/}
            actions={actions}
            modal={true}
            open={this.props.openDialogRegister}
            onRequestClose={this.props.whenCloseDialog}>
            
            <TextField
                ref="captcha"
                style={{fontWeight:"300"}}
                floatingLabelStyle={{fontWeight:"300"}}
                hintText={"填写验证码"/*messages.app_username*/}
            /> : null}
        </Dialog>
    },

    handleSubmit(){
        //console.log("");
        console.log("this.refs.captcha.getValue()",this.refs.captcha.getValue());
    },
});