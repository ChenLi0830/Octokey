/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * Dialog to ask user to install plugin
 *******************************************************************************/
const {
    Dialog,
    FlatButton,
    TextField
    } = MUI;

PluginInstallDialog = React.createClass({
    propTypes: {
        openDialogPlugin: React.PropTypes.bool.isRequired,
        whenCloseDialog: React.PropTypes.func.isRequired
    },

    render(){
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.props.whenCloseDialog}/>,
            <FlatButton
                secondary={true}
                label="安装"
                onTouchTap={this.handleSubmit}/>
        ];

        return <Dialog
            title={"请安装ZenID浏览器插件"}
            actions={actions}
            modal={false}
            open={this.props.openDialogPlugin}
            onRequestClose={this.props.whenCloseDialog}>

            请安装插件提高ZenID使用体验.
        </Dialog>
    },


    handleSubmit(){
        //location.reload();
        chrome.webstore.install(undefined, ()=> {
            //console.log("Plugin successfully installed.");
            location.reload();
        }, (err)=> {
            console.log(err);
        });
        this.props.whenCloseDialog();
    },
});