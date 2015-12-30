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

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={AppLoading}/>
    <Route path="/list" component={AppHome}/>
    <Route path="/catalog" component={Catalog}/>
    <Route path="*" component={AppNotFound}/>
  </Route>
);

const router = (
  <Router history={createHistory()}>
    {routes}
  </Router>);

Meteor.startup(function () {
  ReactDOM.render(router, document.getElementById("app-container"));
});
