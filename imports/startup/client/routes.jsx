import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
var App = require("../../ui/App.jsx");
var AuthSignInNew = require('../../ui/accounts/AuthSignInNew.jsx');
var ListPage = require('../../ui/main-page/ListPage.jsx');
var CatalogContainer = require('../../ui/catalog-page/CatalogContainer.jsx');
var AuthJoin = require('../../ui/accounts/AuthJoin.jsx');

var PageNotFound = require('../../ui/PageNotFound.jsx');
var IntlWrapper = require('../../ui/IntlWrapper.jsx');
var VerifyEmailTokenPage = require('../../ui/VerifyEmailTokenPage.jsx');
const AdminContainer = require("../../ui/admin/AdminContainer.jsx");
const TopicTopApps = require("../../ui/admin/TopicTopApps.jsx");

function requireAuth(nextState, replace) {
  if (!Meteor.userId()) {
    replace('/login');
  }
}

function requireAdmin (nextState, replace){
  requireAuth(nextState, replace);
  if (!Roles.userIsInRole(Meteor.userId(), "admin")){
    alert("You are not authorized, 拒绝直接访问, 请从footer Link到链接");
    replace('/login');
  }
}

function verifyNotLogin(nextState, replace) {
  if (Meteor.userId()) {
    replace('/list');
  }
}

const router = (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={AuthSignInNew} onEnter={verifyNotLogin}/>
        <Route path="list" component={ListPage} onEnter={requireAuth}/>
        <Route path="catalog" component={CatalogContainer} onEnter={requireAuth}/>
        <Route path="join" component={AuthJoin} onEnter={verifyNotLogin}/>
        <Route path="login" component={AuthSignInNew} onEnter={verifyNotLogin}/>
        {/*<Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>*/}
        <Route path="verify-email/:token" component={VerifyEmailTokenPage}/>
        <Route path="adminPanel" component={AdminContainer} onEnter={requireAdmin}>
          <Route path="overallTop" component={TopicTopApps}/>
        </Route>
        <Route path="*" component={PageNotFound}/>
      </Route>
    </Router>
);

export const renderRoutes = <IntlWrapper router={router}/>;
