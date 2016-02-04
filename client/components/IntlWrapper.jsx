import languages from '../locales';
const {IntlProvider} = ReactIntl;

IntlWrapper = React.createClass({
    mixins: [Reflux.listenTo(LanguageStore, 'languageChange')],

    propTypes: {
        router: React.PropTypes.object.isRequired,
    },

    getInitialState(){
        return {
            locale:"zh",
            //locale:"en-US",
        }
    },

    render(){
        let intlData = this.getIntlData(this.state.locale);
        return <IntlProvider {...intlData}>
            {this.props.router}
        </IntlProvider>
    },

    getIntlData(locale){
        //var locale = navigator.language.split('-');
        //locale = locale[1] ? `${locale[0]}-${locale[1].toUpperCase()}` : navigator.language;
        //locale = "zh";
        var strings = languages[locale] ? languages[locale] : languages["en-US"];
        //strings = Object.assign(languages["en-US"], strings);

        //console.log("locale", locale);
        //console.log("strings", strings);

        return {
            locale: locale,
            messages: strings
        };
    },

    languageChange(event, locale){
        this.setState({locale:locale});
    },
});