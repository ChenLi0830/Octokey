/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * routes uses React-router, it is the root of the client-side app
 *******************************************************************************/
var App = require('./components/App.jsx');
var ListPage = require('./components/main-page/ListPage.jsx');
var CatalogContainer = require('./components/catalog-page/CatalogContainer.jsx');
var AuthJoin = require('./components/accounts/AuthJoin.jsx');
var AuthSignInNew = require('./components/accounts/AuthSignInNew.jsx');
var PageNotFound = require('./components/PageNotFound.jsx');
var IntlWrapper = require('./components/IntlWrapper.jsx');
var AuthSignIn = require('./components/accounts/AuthSignIn.jsx');
var VerifyEmailTokenPage = require('./components/VerifyEmailTokenPage.jsx');

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

const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={AuthSignIn} onEnter={verifyNotLogin}/>
      <Route path="/list" component={ListPage} onEnter={requireAuth}/>
      <Route path="/catalog" component={CatalogContainer} onEnter={requireAuth}/>
      <Route path="/join" component={AuthJoin} onEnter={verifyNotLogin}/>
      <Route path="/login" component={AuthSignInNew} onEnter={verifyNotLogin}/>
      {<Route path="/login_bak" component={AuthSignIn} onEnter={verifyNotLogin}/>}
      {/*<Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>*/}
      {<Route path="/verify-email/:token" component={VerifyEmailTokenPage}/>}
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