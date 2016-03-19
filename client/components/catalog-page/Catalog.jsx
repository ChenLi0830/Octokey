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
        console.log("getMeteorData re-run");
        const subsHandles = [
            Meteor.subscribe("zenCategories"),
            Meteor.subscribe("zenApps"),
            Meteor.subscribe("userApps"),
        ];
        const subsReady = _.every(subsHandles, function (subsHandle) {
            //console.log("subsHandle", subsHandle, "is ready?", subsHandle.ready());
            return subsHandle.ready();
        });

        const allPublicApps = ZenApps.find(
            {},
            {reactive: false}
        ).fetch();

        const appsOfUser = UserApps.findOne(
            {userId: Meteor.userId()},
            {reactive: false}
        );

        const zenCategories = ZenCategories.find(
            {},
            {sort: {index: 1}, reactive: false}
        ).fetch();

        let subscribeList = [];
        if (subsReady) {
            console.log("ZenApps",ZenApps);
            console.log("allPublicApps",allPublicApps);
            //console.log("ZenApps",ZenApps);

            allPublicApps.map(function (publicApp) {
                let subscribed = _.findIndex(appsOfUser.publicApps, function (subscribedApp) {
                        return subscribedApp.appId === publicApp._id
                    }) > -1;
                subscribeList[publicApp._id] = subscribed;
            })
        }

        return {
            //appsOfCategory: appsOfCategory,
            allPublicApps: allPublicApps,
            zenCategories: zenCategories,
            subscribeList: subscribeList,
            subsReady: subsReady
        }
    },

    render(){
        //console.log("Actions",Actions);
        //console.log("this.data.subscribedPublicApps",this.data.subscribedPublicApps);

        //console.log("state.chosenCategory: ", this.state.chosenCategory);
        let catalogPage = (
            <div>
                <Row>
                    <Col span="6">
                        <CatalogSideBar zenCategories={this.data.zenCategories}
                                        zenApps={this.data.allPublicApps}
                                        subscribeList={this.data.subscribeList}
                        />
                    </Col>
                    <Col span="18">
                        <CatalogAppsBox zenCategories={this.data.zenCategories}
                                        subscribeList={this.data.subscribeList}
                                        chosenCategory={this.state.chosenCategory}
                        />
                    </Col>
                </Row>
            </div>
        );

        return <div>
            {this.data.subsReady ? catalogPage /*<AppLoading/>*/ : <AppLoading/>}
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