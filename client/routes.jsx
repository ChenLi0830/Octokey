//Accounts.ui.config({
//  passwordSignupFields: "USERNAME_ONLY"
//});

import createBrowserHistory from 'history/lib/createBrowserHistory';
import languages from './locales';

const {
    Router,
    Route,
    IndexRoute,
    browserHistory
    } = ReactRouter;

// const createHistory = ReactRouter.history.createHistory;

const {IntlProvider, FormattedNumber, FormattedPlural} = ReactIntl;

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
    <Router history={createBrowserHistory()}>
        {routes}
    </Router>);

Meteor.startup(function () {
    const intlData = getIntlData();

    ReactDOM.render(
        //<IntlProvider locale="es" messages={esMessages}>
        <IntlProvider {...intlData}>
            {router}
        </IntlProvider>, document.getElementById("app-container")
    );
});

function getIntlData(){
    var locale = navigator.language.split('-');
    locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;

    //locale = "zh-CN";
    //console.log("locale", locale);

    var strings = languages[locale] ? languages[locale] : languages['en-US'];
    strings = Object.assign(languages['en-US'], strings);

    //console.log("strings", strings);

    return {
        locale: "en-US",
        messages: strings
    };
};