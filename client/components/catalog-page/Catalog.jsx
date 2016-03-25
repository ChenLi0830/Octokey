/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog page component, called by "routes", used by "App"
 *******************************************************************************/
var CatalogSideBar = require('./CatalogSidebar.jsx');
var CatalogAppsBox = require('./CatalogAppsBox.jsx');
var AppLoading = require('../AppLoading.jsx');

import { Row, Col } from 'antd';

var Catalog = React.createClass({
    mixins: [
        ReactMeteorData,
        Reflux.listenTo(CategoryStore, 'categoryChange')
    ],

    getInitialState(){
        return {
            chosenCategory: "all",
        }
    },

    getMeteorData(){
        OctoAPI.fetchDataToSessionIfNull("allPublicApps", "getAllPublicApps");
        OctoAPI.fetchDataToSessionIfNull("allCategories", "getAllCategories");
        
        const subsHandles = [
            Session.get("allPublicApps"),
            Session.get("allCategories"),
            Meteor.subscribe("userApps"),
        ];
        const subsReady = OctoAPI.subsHandlesAreReady(subsHandles);

        const AppOfUser = UserApps.findOne({userId: Meteor.userId()}, {reactive: true});

        let subscribeList = [];
        if (subsReady) {
            Session.get("allPublicApps").map(function (publicApp) {
                let subscribed = _.findIndex(AppOfUser.publicApps, function (subscribedApp) {
                        return subscribedApp.appId === publicApp._id
                    }) > -1;
                subscribeList[publicApp._id] = subscribed;
            })
        }

        return {
            subscribeList: subscribeList,
            subsReady: subsReady
        }
    },


    render(){
        if (!this.data.subsReady){
            return <AppLoading/>
        }
        let catalogPage = (
            <div>
                <Row>
                    <Col span="6">
                        <CatalogSideBar zenCategories={Session.get("allCategories")}
                                        zenApps={Session.get("allPublicApps")}
                                        subscribeList={this.data.subscribeList}
                        />
                    </Col>
                    <Col span="18">
                        <CatalogAppsBox zenCategories={Session.get("allCategories")}
                                        subscribeList={this.data.subscribeList}
                                        chosenCategory={this.state.chosenCategory}
                        />
                    </Col>
                </Row>
            </div>
        );

        return <div>
            {catalogPage}
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