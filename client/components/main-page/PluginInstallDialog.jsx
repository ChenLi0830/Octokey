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
    } = MUI;

var PluginInstallDialog = React.createClass({
  propTypes: {
    openDialogPlugin: React.PropTypes.bool.isRequired,
    whenCloseDialog: React.PropTypes.func.isRequired
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  render(){
    const {messages} = this.context.intl;

    const actions = [
      <FlatButton
          label={messages.ext_btn_cancel}
          primary={true}
          onTouchTap={this.props.whenCloseDialog}/>,
      <FlatButton
          secondary={true}
          label={messages.ext_btn_install}
          onTouchTap={this.handleSubmit}/>
    ];

    return <Dialog
        title={messages.ext_install_title}
        actions={actions}
        modal={false}
        open={this.props.openDialogPlugin}
        onRequestClose={this.props.whenCloseDialog}>
      {messages.ext_install_msg}
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

module.exports = PluginInstallDialog;