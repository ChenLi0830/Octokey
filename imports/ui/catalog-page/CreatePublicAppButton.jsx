/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Create Public App Button component, called by "CatalogSideBar"
 *******************************************************************************/ import React from "react"
const AppModalContainerAdd = require('./AppModalContainerAdd.jsx');

import RaisedButton from "material-ui/RaisedButton";
import Modal from "antd/lib/modal";
import Button from "antd/lib/button";

var selectedCategories = [0];

var CreatePublicAppButton = React.createClass({
  propTypes: {
    allCategories: React.PropTypes.array.isRequired
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState() {//for modal
    return {
      modalOpen: false,
    };
  },

  close() {//for modal
    this.setState({
      modalOpen: false,
    });
  },

  open() {//for modal
    this.setState({modalOpen: true});
  },

  render(){
    const {messages} = this.context.intl;
    let button = (<div style={{textAlign:"center", padding:"10px 0 20px 0"}}>
      <RaisedButton label={messages.cata_createPubApp}
                    primary={true}
                    onClick={this.open}
                    labelStyle={{color:"white"}}/>
    </div>);

    return <div>
      <AppModalContainerAdd
          modalOpen={this.state.modalOpen}
          onModalClose={()=>{this.setState({modalOpen:false});}}
          allCategories={this.props.allCategories}
      />

      {button}

    </div>
  },
});

module.exports = CreatePublicAppButton;