//Accounts.ui.config({
//  passwordSignupFields: "USERNAME_ONLY"
//});

//Meteor.subscribe("tasks");

const {
    Router,
    Route,
    IndexRoute
    } = ReactRouter;

const createHistory = ReactRouter.history.createHistory;

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
    <Router history={createHistory()}>
        {routes}
    </Router>);

/*Meteor.startup(() => {
 ReactDOM.render(<TestMUI/>, document.getElementById('app-container'));
 });*/

Meteor.startup(function () {
    ReactDOM.render(router, document.getElementById("app-container"));
});
