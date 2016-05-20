/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Search box component, called by "CatalogSideBar"
 *******************************************************************************/ import React from "react"
var CatalogSingleApp = require('./CatalogSingleApp.jsx');

import { Icon, Input, Button } from 'antd';
import classNames from 'classnames';
import _ from 'lodash'

const InputGroup = Input.Group;

import { Popover} from 'antd';

const styles = {
  searchInput: {
    width: "90%",
    margin: "10px auto"
  }
};

var SearchBox = React.createClass({

  contextTypes: {
    intl: React.PropTypes.object.isRequired
  },

  propTypes: {
    zenApps: React.PropTypes.array.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getInitialState(){
    return {
      searchText: "",
      searchResult: null,
      popOpen: false,
      searchOnFocus: false,
    }
  },

  render(){
    messages = this.context.intl.messages;
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.searchText.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.searchOnFocus,
    });

    return <Popover overlay={this.state.searchResult}
                    visible={this.state.popOpen}
                    placement="bottom"
                    overlayStyle={{zIndex:"inherit"}}
                    trigger="click"
                    onVisibleChange={this.handlePopVisibleChange}>

      <InputGroup className={searchCls} style={styles.searchInput}>
        <Input placeholder={messages["searchApps-搜索网站"]}
               style={{textAlign:"center", zIndex:"inherit"}}
               value={this.state.searchText}
               onChange={this.handleSearch}
               onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur}
               onKeyDown={(e)=>{e.key==='Escape' && this.setState({searchText:"",popOpen:false});}}/>
        <div className="ant-input-group-wrap">
          <Button className={btnCls} size={this.props.size}>
            <Icon type="search"/>
          </Button>
        </div>
      </InputGroup>

    </Popover>;
  },

  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  },

  handlePopVisibleChange(popOpen){
    if (popOpen === true && this.state.searchText.trim().length === 0) {
      //Don't anything if search Text is empty.
      return;
    }
    this.setState({popOpen});
  },

  handleSearch(event){
    let eventTarget = event.currentTarget;
    this.setState({searchText: event.target.value},
        function () {
          let searchText = this.state.searchText.trim().toLowerCase();
          if (searchText.length === 0) {//If no search text
            this.setState({searchResult: null, popOpen: false});
            return;
          }

          const searchResult = _.filter(this.props.zenApps, (app)=> {
            return app.appName.toLowerCase().startsWith(searchText);
          });

            let renderedResult = searchResult.map((app)=> {
              const logoURL = app.noLogo ? "" : OctoClientAPI.getLogoUrl(app._id),
                  subscribed = this.props.subscribeList[app._id];

              return <CatalogSingleApp key={app._id}
                                       logoURL={logoURL}
                                       appName={app.appName}
                                       loginLink={app.loginLink}
                                       registerLink={app.registerLink}
                                       selectedCategoryNames={app.categoryNames}
                                       popUpLoginFlag={app.popUpLoginFlag}
                                       homepageLink={app.homepageLink}
                                       appId={app._id}
                                       subscribed={subscribed}
                                       condensed={true}
                                       subsCount={app.subscribeCount}
                                       allCategories={this.props.allCategories}
              />
            });

            const finalResult = (renderedResult.length === 0 ?
                messages.cata_notFound :
                renderedResult);

            this.setState({
              searchResult: finalResult,
              popOpen: true,
              anchorEl: eventTarget,
            });
        }.bind(this));
  }
});

module.exports = SearchBox;