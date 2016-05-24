/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Dialog to ask user to install plugin
 *******************************************************************************/
import React from "react"
import {Dialog} from "material-ui/Dialog";
import {FlatButton} from "material-ui/FlatButton";
import {Modal} from 'antd/lib/modal';
import {Button} from "antd/lib/button";

const BrowserLogoBox = require('./BrowserLogoBox.jsx');

const styles = {};
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

    return (
        <div>
          <Modal title={messages.ext_install_title}
                 visible={this.props.openDialogPlugin}
                 okText={messages.ext_btn_install}
                 cancelText={messages.ext_btn_cancel}
                 onOk={this.handleChrome}
                 onCancel={this.props.whenCloseDialog}
                 width="680px">
            <div style={{textAlign:"center"}}>
              <BrowserLogoBox name="Chrome" logoPath="/img/browsersLogo/chrome.png"
                              onClick={this.handleChrome}/>
              <BrowserLogoBox name="百度浏览器" logoPath="/img/browsersLogo/baidu.png"
                              onClick={this.handleBaidu}/>
              <BrowserLogoBox name="360安全" logoPath="/img/browsersLogo/360Security.png"
                              onClick={this.handle360Security}/>
              <BrowserLogoBox name="360极速" logoPath="/img/browsersLogo/360fast.png"
                              onClick={this.handle360Fast}/>
            </div>
          </Modal>
        </div>
    )
  },

  handleChrome(){
    //console.log("chrome");

    var win = window.open(
        "https://chrome.google.com/webstore/detail/o%E9%92%A5%E5%8C%99/nehponjfbiigcobaphdahhhiemfpaeob");
    win.focus();
    this.props.whenCloseDialog();

    /*chrome.webstore.install(undefined, ()=> {
     //console.log("Plugin successfully installed.");
     location.reload();
     }, (err)=> {
     console.log(err);
     this.props.whenCloseDialog();
     });*/
  },

  handleBaidu(){
    //console.log("360 security");
    var win = window.open("http://chajian.baidu.com/2015/#home/ibjiiiailkhfaakoopiiflobajlkiock");
    win.focus();
    this.props.whenCloseDialog();
  },

  handle360Security(){
    //console.log("360 security");
    var win = window.open("https://ext.se.360.cn/webstore/detail/oeklhehdhkbiekgbnmlbdlnajghagmkm");
    win.focus();
    this.props.whenCloseDialog();
  },

  handle360Fast(){
    //console.log("360 fast");
    var win = window.open(
        "https://ext.chrome.360.cn/webstore/detail/oeklhehdhkbiekgbnmlbdlnajghagmkm");
    win.focus();
    this.props.whenCloseDialog();
  },
});

module.exports = PluginInstallDialog;