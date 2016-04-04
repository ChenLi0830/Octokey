/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Apps Box component - called by "Catalog"
 *******************************************************************************/
var CatalogSingleApp = require('./CatalogSingleApp.jsx');
var AppLoading = require('../AppLoading.jsx');
var SearchBox = require('./SearchBox.jsx');

const {
    Paper,
    List,
    } = MUI;

import {Modal, Form, Input, Button, Checkbox, Radio, Row, Col, Tooltip, Icon, Upload } from 'antd/lib/';
const FormItem = Form.Item;

import Subheader from 'material-ui/lib/Subheader';

const {
    NavigationExpandMoreIcon
    } = SvgIcons;

const styles = {
  appListPaper: {
    backgroundColor: ZenColor.white,
    padding: 0,
    borderRadius: "5px"
  }
};

const InitialFetchNumber = 20;

var CatalogAppsBox = React.createClass({
  mixins: [ReactMeteorData,],

  getMeteorData(){
    if (this.needFetchApps) {
      OctoAPI.fetchDataToSession("appsOfChosenCategory", "getPublicAppsOfCategory",
          this.props.chosenCategory,
          this.state.requestAppsNumber);
      this.needFetchApps = false;
    }
    const subsHandles = [
      //Subs is ready when fetched apps number = requested number OR total apps number
      Session.get("appsOfChosenCategory") &&
      (Session.get("appsOfChosenCategory").apps.length === this.state.requestAppsNumber ||
      Session.get("appsOfChosenCategory").apps.length === Session.get("appsOfChosenCategory").total)
    ];

    return {
      subsReady: OctoAPI.subsHandlesAreReady(subsHandles),
    };
  },

  propTypes: {
    allCategories: React.PropTypes.array.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
    chosenCategory: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    //needFetchApps is used for determine whether new apps should be fetched
    this.needFetchApps = true;
    return {
      showModal: false,
      preview: null,
      editAppId: null,
      requestAppsNumber: InitialFetchNumber,//Initialed in componentWillReceiveProps
      loadingMoreApp: false,
    }
  },

  componentWillReceiveProps(nextProps){
    if (nextProps.chosenCategory !== this.props.chosenCategory) {
      //Apps should be fetched if the user chose a different category
      this.needFetchApps = true;
      this.setState({requestAppsNumber: InitialFetchNumber});
    }
  },

  handleInfiniteLoad(){
    //Won't try to load more apps when data-fetching is not finished.
    if (!this.data.subsReady) {
      return;
    }

    this.needFetchApps = true;
    this.setState({
      requestAppsNumber: Math.min(this.state.requestAppsNumber + 20,
          Session.get("appsOfChosenCategory").total),
      loadingMoreApp: true
    });
  },

  /*  elementInfiniteLoad() {
   return <AppLoading/>;
   },*/

  render(){
    if (!this.data.subsReady && !Session.get("appsOfChosenCategory")) {
      return <AppLoading/>
    }

    const {messages} = this.context.intl;

    const appsOfChosenCategory = (Session.get("appsOfChosenCategory").apps.map(function (app) {
          let logoURL = OctoAPI.getLogoUrl(app._id);
          let subscribed = this.props.subscribeList[app._id];
          return <CatalogSingleApp key={app._id}
                                   logoURL={logoURL}
                                   appName={app.appName}
                                   loginLink={app.loginLink}
                                   registerLink={app.registerLink}
                                   selectedCategoryNames={app.categoryNames}
                                   whenClicked={this.handleClick}
                                   appId={app._id}
                                   subscribed={subscribed}
                                   subsCount={app.subscribeCount}
                                   allCategories={this.props.allCategories}
          />
        }.bind(this))
    );

    const noMoreApps = appsOfChosenCategory.length === Session.get("appsOfChosenCategory").total;

    return <div className="layout-margin">
      <Paper zDepth={1}
             style={styles.appListPaper}>
        <List style={{backgroundColor:ZenColor.white}}>
          {/*<Subheader>{messages.cata_listTitle}</Subheader>*/}
          <SearchBox zenApps={this.props.zenApps}
                     subscribeList={this.props.subscribeList}
                     allCategories={this.props.allCategories}
          />
          {appsOfChosenCategory}
        </List>

        {// Only show “加载更多” 按钮 if appsOfChosenCategory number > InitialFetchNumber
          Session.get("appsOfChosenCategory").total > InitialFetchNumber ?
              <Button
                  type="dashed"
                  size="large"
                  loading={!this.data.subsReady}
                  onClick={this.handleInfiniteLoad}
                  style={{display:"block", width: "100%", margin: "20px auto"}}>
                {noMoreApps ? messages["noMoreApps-已经到底了"] : messages["loadMoreApps-加载更多"]}
              </Button> : null}
      </Paper>
    </div>
  }
});

module.exports = CatalogAppsBox;