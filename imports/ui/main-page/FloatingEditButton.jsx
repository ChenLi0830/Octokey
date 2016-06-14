/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Floating Action Button component in Apps container, called by "AppsContainer"
 *******************************************************************************/
import React from "react";
import _ from "lodash";
import FloatingActionButton from "material-ui/FloatingActionButton";

import Tooltip from 'antd/lib/tooltip';

import {
    ToggleStar,
    ActionList,
    ContentCreate,
    ContentAdd,
    ContentRemove,
    ActionSettings,
    AvFiberNew,
    } from "material-ui/svg-icons"

const styles = {
  floatingBtn: {
    paddingTop: 15,
    marginBottom: 0,
    zIndex: 450,
    position: "fixed",
    right: 40,
    bottom: 25,
  },
  floatingUl: {
    left: 0,
    right: 0,
    textAlign: "center",
    margin: 0,
    visibility: "hidden",
  },
  floatingLi: {
    marginBottom: 15,
  }
}

var FloatingEditButton = React.createClass({

  propTypes: {
    whenEditButtonClicked: React.PropTypes.func.isRequired,
    userEditStatus: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      FABActive: false,
      hoveredTooltip: -1,
    }
  },

  render(){
    const {messages} = this.context.intl;

    let miniButtonIconElements = [/*<ContentCreate/>, */<ContentAdd/>, <ContentRemove/>,
      <ContentCreate/>,
      /*暂时隐藏自动注册选项 <AvFiberNew/>*/];
    let miniIconColor = [
      {background: ZenColor.cyan, icon: ZenColor.white},
      {background: ZenColor.orange, icon: ZenColor.white},
      {background: ZenColor.blueGrey, icon: ZenColor.white},
      {background: ZenColor.cyan, icon: ZenColor.white}
    ];
    const toolTips = [messages.tooltip_add, messages.tooltip_delete,
      messages.tooltip_setting, messages.tooltip_register];


    let buttonList = miniButtonIconElements.map(function (iconElement, i) {
      let basicLiStyle = this.state.FABActive ?
      {
        transform: "scaleY(1) scaleX(1) translateY(0px) translateX(0px)",
        msTransform: "scaleY(1) scaleX(1) translateY(0px) translateX(0px)",
        WebkitTransform: "scaleY(1) scaleX(1) translateY(0px) translateX(0px)",
        opacity: 1,
        transitionDuration: "0.3s",
        visibility: "visible"
      }
          : {
        transform: "scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)",
        msTransform: "scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)",
        WebkitTransform: "scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)",
        opacity: 0,
        transitionDuration: "0.2s",
        visibility: "hidden"
      };
      basicLiStyle.transitionDelay = (miniButtonIconElements.length - i) * 0.05 + "s";
      return <li style={_.extend({},basicLiStyle,styles.floatingLi)} key={i}>
        <Tooltip placement="left" title={toolTips[i]}>
          <FloatingActionButton
              mini={true}
              backgroundColor={ZenColor.cyan}
              //backgroundColor={miniIconColor[i].background}
              iconStyle={{fill:miniIconColor[i].icon}}
              onTouchTap={this.handleFABClick.bind(null,i)}
              children={iconElement}
              onMouseEnter={this.handleTooltipOpen.bind(this,i)}
              onMouseLeave={this.handleTooltipClose}
          />
        </Tooltip>
        {/*<Tooltip show={this.state.hoveredTooltip===i}
         label={toolTips[i]}
         style={{right: 62, top:16}}
         horizontalPosition="left"
         verticalPosition="top"
         touch={true}
         />*/}
      </li>
    }.bind(this));

    const FAB = this.getFAB(this.props.userEditStatus, buttonList);

    return FAB;
  },

  getFAB(userEditStatus, buttonList){
    switch (userEditStatus) {
      case "default":
        return (
            <div style={styles.floatingBtn} onMouseLeave={this.handleLeaveFAB}>
              <ul className="list-unstyled" style={styles.floatingUl}>
                {buttonList}
              </ul>
              <FloatingActionButton
                  backgroundColor={ZenColor.cyan}
                  iconStyle={{fill:ZenColor.white}}
                  onMouseEnter={this.handleHoverFAB}>
                <ActionSettings style={{width:"28px"}}/>
              </FloatingActionButton>
            </div>
        );
        break;
      default :
        return (
            <div style={styles.floatingBtn}>
              <FloatingActionButton
                  backgroundColor={ZenColor.orange}
                  style={{color:ZenColor.white}}
                  onTouchTap={this.props.whenEditButtonClicked}>
                <p>{this.context.intl.messages.FAB_cancel}</p>
              </FloatingActionButton>
            </div>
        );
        break;
    }
  },

  handleHoverFAB(){
    this.setState({FABActive: true});
  },

  handleLeaveFAB(){
    this.setState({FABActive: false});
  },

  handleFABClick(i){
    clearTimeout(this.tooltipTimer);
    this.setState({hoveredTooltip: -1});
    this.props.whenEditButtonClicked(i);
  },

  handleTooltipOpen(i){
    this.tooltipTimer = setTimeout(()=> {
      this.setState({hoveredTooltip: i});
    }, 100)
  },

  handleTooltipClose(){
    clearTimeout(this.tooltipTimer);
    this.setState({hoveredTooltip: -1});
  }
});

module.exports = FloatingEditButton;