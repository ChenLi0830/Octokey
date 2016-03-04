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
        <Route path="/join" component={AuthJoinPage} onEnter={verifyNotLogin}/>
        {<Route path="/loginEmail" component={AuthSignInEmail} onEnter={verifyNotLogin}/>}
        <Route path="/loginMobile" component={AuthSignInMobile} onEnter={verifyNotLogin}/>
        {/*<Route path="/reset" component={AuthForgotPwdPage} onEnter={verifyNotLogin}/>*/}
        {/*<Route path="/verify-email/:token" component={AppNotFound} onEnter={verifyEmail}/>*/}
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