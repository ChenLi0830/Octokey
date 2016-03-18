/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * routes uses React-router, it is the root of the client-side app
 *******************************************************************************/
var App = require('./components/App.jsx');
var AppsContainer = require('./components/main-page/AppsContainer.jsx');
var Catalog = require('./components/catalog-page/Catalog.jsx');
var JoinUsingMobilePage = require('./components/accounts/JoinUsingMobilePage.jsx');
var JoinUsingEmailPage = require('./components/accounts/JoinUsingEmailPage.jsx');
var AuthSignInEmail = require('./components/accounts/AuthSignInEmail.jsx');
var AuthSignInMobile = require('./components/accounts/AuthSignInMobile.jsx');
var PageNotFound = require('./components/PageNotFound.jsx');
var IntlWrapper = require('./components/IntlWrapper.jsx');

//Todo use the following line instead of /public/css/antd-index.css when Meteor fix the problem of importing css
// from npm
// packages.
//import 'antd/lib/index.css'; // only need to import once in entry module


const {
    Router,
    Route,
    IndexRoute,
    browserHistory,
    } = ReactRouter;

// const createHistory = ReactRouter.history.createHistory;

function requireAuth(nextState, replace) {
    if (!Meteor.userId()){
        replace('/loginMobile');
    }
}

function verifyNotLogin(nextState, replace){
    if (Meteor.userId()){
        replace('/list');
    }
}

function verifyEmail(nextState, replace) {
    replace('/list');
    //Todo make token verification work
    ///*Accounts.verifyEmail( nextState.params.token, function(error){
    //    if ( error ) {
    //        console.log(error.reason);
    //        console.log("replace", replace);
    //        replace('/list');
    //        //Bert.alert( error.reason, 'danger' );
    //    } else {
    //        //console.log("verify successful!");
    //        console.log("replace", replace);
    //        //redirectUrl = "/list";
    //        replace('/list');
    //        //Bert.alert( 'Email verified! Thanks!', 'success' );
    //    }
    //});*/
    //replace(redirectUrl);
}

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={AuthSignInMobile} onEnter={verifyNotLogin}/>
        <Route path="/list" component={AppsContainer} onEnter={requireAuth}/>
        <Route path="/catalog" component={Catalog} onEnter={requireAuth}/>
        <Route path="/join" component={JoinUsingMobilePage} onEnter={verifyNotLogin}/>
        <Route path="/joinEmail" component={JoinUsingEmailPage} onEnter={verifyNotLogin}/>
        {<Route path="/loginEmail" component={AuthSignInEmail} onEnter={verifyNotLogin}/>}
        <Route path="/loginMobile" component={AuthSignInMobile} onEnter={verifyNotLogin}/>
        {/*<Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>*/}
        {/*<Route path="/verify-email/:token" component={AppNotFound} onEnter={verifyEmail}/>*/}
        <Route path="/*" component={PageNotFound}/>
    </Route>
);

const router = (
    <Router history={browserHistory}>
        {routes}
    </Router>);

Meteor.startup(function () {
    ReactDOM.render(<IntlWrapper router={router}/>, document.getElementById("app-container"));
});