/**
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * The component for a Single App, called by "CatalogAppsBox"
 */

import React from "react";
import {
    Row,
    Col,
    } from "react-bootstrap";

import {
    Toggle,
    } from "material-ui";

const styles = {
  row: {
    height: 100,
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "340px",
  },
  noLogoBox: {
    position: "relative",
    backgroundColor: "#3399FF",
    borderRadius: "5px",
    top: "25%",
    height: "50px",
    width: "50px",
    fontSize: "28px",
    display: "inline-block",
/* line-height: 100px; */
/* top: 25%; */
/* left: 25%; */
/* margin-top: 25px; */
  },
  noLogoBoxCondensed: {
    top: "37%",
    height: "25px",
    width: "25px",
    fontSize: "18px",
  },
  noLogoText: {
    textAlign: "center",
    top: "50%",
    transform: "translateY(-50%)",
    position: "relative",
    color: "white",
    fontWeight: "800",
  },
};

const AppModalContainerEdit = require('./AppModalContainerEdit.jsx');

var CatalogSingleApp = React.createClass({
  propTypes: {
    logoURL: React.PropTypes.string.isRequired,
    appName: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    registerLink: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    selectedCategoryNames: React.PropTypes.array.isRequired,
    //Todo add isRequired for the following to parameters
    popUpLoginFlag: React.PropTypes.bool,
    homepageLink: React.PropTypes.string,

    onModalOpen: React.PropTypes.func.isRequired,
    subscribed: React.PropTypes.bool.isRequired,
    condensed: React.PropTypes.bool.isRequired,
    subsCount: React.PropTypes.number.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getDefaultProps: function () {
    return {
      condensed: false,
      onModalOpen: ()=> {
      },
      subsCount: 0,
      registerLink: "",
    };
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      hovered: false,
      modalOpen: false,
    }
  },

  handleMouseOver(){
    this.setState({
      hovered: true
    })
  },

  handleMouseOut(){
    this.setState({
      hovered: false
    })
  },

  render(){
    const {messages} = this.context.intl;
    const {logoURL,appName,loginLink,registerLink,appId,
        popUpLoginFlag,homepageLink,selectedCategoryNames, condensed,subsCount} = this.props;

    let handleToggle = this.props.subscribed ? this.handleUnsubscribe : this.handleSubscribe;
    let labelText = this.props.subscribed ? messages.cata_added : messages.cata_add;
    let toggleState = this.props.subscribed ? true : false;

    let toggleButton = <Toggle
        name="toggleName1"
        value="toggleValue1"
        label={labelText}
        labelPosition="right"
        labelStyle={{fontWeight:"lighter",color:ZenColor.blueGrey}}
        onToggle={handleToggle}
        defaultToggled={toggleState}/>;

    return <div>
      <AppModalContainerEdit
          modalOpen={this.state.modalOpen}
          logoURL={logoURL}
          appName={appName}
          loginLink={loginLink}
          registerLink={registerLink}
          popUpLoginFlag={popUpLoginFlag}
          homepageLink={homepageLink}
          appId={appId}
          selectedCategoryNames={selectedCategoryNames}
          onModalClose={()=>{console.log("onModalClose called");this.setState({modalOpen:false});}}
          allCategories={this.props.allCategories}
      />

      <Row style={_.extend({}, styles.row,
                                    {backgroundColor: this.state.hovered? ZenColor.grey1_5 : ZenColor.white}
                            )}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
        <Col xs={3} sm={3} md={condensed? 2:3}
             onClick={()=>{this.handleEdit()}}
             style={{height:"100%", textAlign:"center"}}>
          {this.props.logoURL === ""?
              <div style={_.extend({}, styles.noLogoBox, condensed?styles.noLogoBoxCondensed:{})}>
                <div style={styles.noLogoText}>{this.props.appName[0]}</div>
              </div> :
              <div style={{display:"block", height:"100%", width:"100%"}}>
                <img src={logoURL} style={{top: "50%", position: "relative", transform: "translateY(-50%)",
                      width:condensed ? "25px": "50px"}}/>
              </div>
          }
        </Col>

        <Col xs={5} sm={4} md={condensed? 5:/*4*/6}
             className="vertical-center">
          <p>{appName}</p>
        </Col>

        <Col xs={4} sm={3} md={condensed? 5:3} className="vertical-center">
          {toggleButton}
        </Col>

        {/*<Col xs={0} sm={2} md={2} xsHidden
         style={{display:condensed?"none":"block",color:ZenColor.grey3}}
         className="vertical-center">
         <p>{subsCount + messages.cata_peopleUse}</p>

         </Col>*/}
      </Row>
    </div>;
  },

  handleEdit(){
    if (OctoClientAPI.isAdmin()) {
      this.setState({modalOpen: true});
      this.props.onModalOpen();
    }
  },

  handleSubscribe() {
    Meteor.call("subscribePublicApp", this.props.appId);
  },

  handleUnsubscribe() {
    Meteor.call("unsubscribePublicApp", this.props.appId);
  }
});

module.exports = CatalogSingleApp;