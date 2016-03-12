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

const {
    Grid,
    Row,
    Col
    } = ReactBootstrap;

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
        const subsHandles = [
            Meteor.subscribe("zenApps"),
            Meteor.subscribe("zenCategories"),
            Meteor.subscribe("userApps"),
        ];
        const subsReady = _.every(subsHandles, function (subsHandle) {
            //console.log("subsHandle", subsHandle, "is ready?", subsHandle.ready());
            return subsHandle.ready();
        });

        //const zenApps = ZenApps.find().fetch();
        const chosenApps = ZenApps.find({
            categoryNames: {
                $in: [this.state.chosenCategory]
            }
        }, {sort: {subscribeCount: -1}, reactive: true}).fetch();

        const allPublicApps = ZenApps.find({}, {reactive: true}).fetch();

        const AppOfUser = UserApps.findOne({userId: Meteor.userId()}, {reactive: true});

        let subscribeList = [];
        if (subsReady){
            allPublicApps.map(function(publicApp){
                let subscribed = _.findIndex(AppOfUser.publicApps, function (subscribedApp) {
                        return subscribedApp.appId === publicApp._id
                    }) > -1;
                subscribeList[publicApp._id] = subscribed;
            })
        }

        return {
            zenApps: chosenApps,
            zenCategories: ZenCategories.find({}, {sort: {index: 1}}).fetch(),
            subscribeList: subscribeList,
            subsReady: subsReady
        }
    },


    render(){
        //console.log("Actions",Actions);
        //console.log("this.data.subscribedPublicApps",this.data.subscribedPublicApps);

        //console.log("state.chosenCategory: ", this.state.chosenCategory);
        let catalogPage = (<Grid>
            <Row>
                <Col sm={3}>
                    <CatalogSideBar zenCategories={this.data.zenCategories}
                                    zenApps = {this.data.zenApps}
                                    subscribeList={this.data.subscribeList}
                    />
                </Col>
                <Col sm={9}>
                    <CatalogAppsBox zenApps={this.data.zenApps} zenCategories={this.data.zenCategories}
                                    subscribeList={this.data.subscribeList}/>
                </Col>
            </Row>
        </Grid>);

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