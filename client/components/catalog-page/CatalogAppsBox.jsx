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
    appListPaper:{
        backgroundColor:ZenColor.white,
        padding:0,
        borderRadius:"5px"
    }
};

var CatalogAppsBox = React.createClass({
    mixins: [ReactMeteorData,],

    getMeteorData(){
        if (this.needFetchApps) {
            //console.log("fetch new apps");
            Session.clear("appsOfChosenCategory"),
            OctoAPI.fetchDataToSession("appsOfChosenCategory", "getPublicAppsOfCategory", this.props.chosenCategory);
            this.needFetchApps = false;
        }
        const subsHandles = [
            Session.get("appsOfChosenCategory"),
        ];
        return {
            subsReady: OctoAPI.subsHandlesAreReady(subsHandles),
        };
    },

    componentWillReceiveProps(nextProps){
        if (nextProps.chosenCategory !== this.props.chosenCategory) {
            //Apps should only be fetched if the user chose a different category
            this.needFetchApps = true;
        }
    },

    propTypes: {
        zenCategories: React.PropTypes.array.isRequired,
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
        }
    },

    render(){
        if (!this.data.subsReady) {
            return <AppLoading/>
        }

        const {messages} = this.context.intl;

        const appsOfChosenCategory = (Session.get("appsOfChosenCategory").map(function (app) {
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
                                         zenCategories={this.props.zenCategories}
                />
            }.bind(this))
        );

        return <div className="layout-margin">
            <Paper zDepth={1}
                   style={styles.appListPaper}>
                <List style={{backgroundColor:ZenColor.white}}>
                    <Subheader>{messages.cata_listTitle}</Subheader>
                    {appsOfChosenCategory}
                </List>
            </Paper>
        </div>
    }
});

module.exports = CatalogAppsBox;