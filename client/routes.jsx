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
var CatalogContainer = require('./components/catalog-page/CatalogContainer.jsx');
var AuthJoin = require('./components/accounts/AuthJoin.jsx');
var PageNotFound = require('./components/PageNotFound.jsx');
var IntlWrapper = require('./components/IntlWrapper.jsx');
var AuthSignIn = require('./components/accounts/AuthSignIn.jsx');

//Todo use the following line instead of /public/css/antd-index.css when Meteor fix the problem of
// importing css from npm packages. import 'antd/lib/index.css'; // only need to import once in
// entry module


const {
    Router,
    Route,
    IndexRoute,
    browserHistory,
    } = ReactRouter;

// const createHistory = ReactRouter.history.createHistory;

function requireAuth(nextState, replace) {
  if (!Meteor.userId()) {
    replace('/login');
  }
}

function verifyNotLogin(nextState, replace) {
  if (Meteor.userId()) {
    replace('/list');
  }
}

function verifyEmail(nextState, replace) {
  //Todo make token verification work
  console.log("nextState.params.token", nextState.params.token);
  Accounts.verifyEmail(nextState.params.token, function (error) {
    if (error) {
      console.log("error", error.reason);
      return window.location.replace("/list");
      //Bert.alert( error.reason, 'danger' );
    }
    //console.log("verify successful!");
    //redirectUrl = "/list";
    window.location.replace("/list");
    //Bert.alert( 'Email verified! Thanks!', 'success' );
  });
}

const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={AuthSignIn} onEnter={verifyNotLogin}/>
      <Route path="/list" component={AppsContainer} onEnter={requireAuth}/>
      <Route path="/catalog" component={CatalogContainer} onEnter={requireAuth}/>
      <Route path="/join" component={AuthJoin} onEnter={verifyNotLogin}/>
      {<Route path="/login" component={AuthSignIn} onEnter={verifyNotLogin}/>}
      {/*<Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>*/}
      {<Route path="/verify-email/:token" component={PageNotFound} onEnter={verifyEmail}/>}
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