/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-31
 *
 * routes uses React-router, it is the root of the client-side app
 *******************************************************************************/

const {
    Router,
    Route,
    IndexRoute,
    browserHistory,
    } = ReactRouter;

// const createHistory = ReactRouter.history.createHistory;

function requireAuth(nextState, replaceState) {
    if (!Meteor.userId())
        replaceState({nextPathname: nextState.location.pathname}, '/login')
}

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={AuthSignInPage}/>
        <Route path="/list" component={AppsContainer} onEnter={requireAuth}/>
        <Route path="/catalog" component={Catalog} onEnter={requireAuth}/>
        <Route path="/signUp" component={AuthJoinPage}/>
        <Route path="/login" component={AuthSignInPage}/>
        <Route path="/reset" component={AuthForgotPwdPage}/>
        <Route path="*" component={AppNotFound}/>
    </Route>
);

const router = (
    <Router history={browserHistory}>
        {routes}
    </Router>);

Meteor.startup(function () {
    ReactDOM.render(<IntlWrapper router={router}/>, document.getElementById("app-container"));
});