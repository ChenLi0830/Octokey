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

function verifyNotLogin(){}

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
        <IndexRoute component={AuthSignInPage}/>
        <Route path="/list" component={AppsContainer} onEnter={requireAuth}/>
        <Route path="/catalog" component={Catalog} onEnter={requireAuth}/>
        <Route path="/signUp" component={AuthJoinPage} onEnter={verifyNotLogin}/>
        <Route path="/login" component={AuthSignInPage} onEnter={verifyNotLogin}/>
        <Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>
        <Route path="/verify-email/:token" component={AppNotFound} onEnter={verifyEmail}/>
        <Route path="/*" component={AppNotFound}/>
    </Route>
);

const router = (
    <Router history={browserHistory}>
        {routes}
    </Router>);

Meteor.startup(function () {
    ReactDOM.render(<IntlWrapper router={router}/>, document.getElementById("app-container"));
});