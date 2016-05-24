/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Catalog page component, called by "routes", used by "App"
 *******************************************************************************/
import React from "react"
import Reflux from "reflux";
import Row from "antd/lib/row";
import Col from "antd/lib/col"

import CategoryStore from '../action-and-stores/CategoryStore.jsx';
var CatalogSideBar = require('./CatalogSidebar.jsx');
var CatalogAppsBox = require('./CatalogAppsBox.jsx');
var AppLoading = require('../AppLoading.jsx');

var Catalog = React.createClass({
  mixins: [
    Reflux.listenTo(CategoryStore, 'categoryChange')
  ],

  propTypes: {
    subsReady: React.PropTypes.bool.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
    allPublicApps: React.PropTypes.array.isRequired,
    allCategories: React.PropTypes.array.isRequired,
  },

  getDefaultProps(){
    return {
      allPublicApps: [],
      subscribeList: [],
      allCategories: [],
    }
  },

  getInitialState(){
    return {
      chosenCategory: "all",
    }
  },

  render(){
    //console.log("run Catalog render with props", this.props);
    if (!this.props.subsReady) {
      return <AppLoading/>
    }
    return <div>
      <div>
        <Row style={{marginBottom:"60px"}}>
          <Col span="6">
            <CatalogSideBar allCategories={this.props.allCategories}
                            zenApps={this.props.allPublicApps}
                            subscribeList={this.props.subscribeList}
            />
          </Col>
          <Col span="18">
            <CatalogAppsBox allCategories={this.props.allCategories}
                            subscribeList={this.props.subscribeList}
                            zenApps={this.props.allPublicApps}
                            chosenCategory={this.state.chosenCategory}
            />
          </Col>
        </Row>
      </div>
    </div>
  },

  categoryChange(event, categoryName){
    //console.log("event",event);
    this.setState({
      chosenCategory: categoryName
    });
  }
});

module.exports = Catalog;